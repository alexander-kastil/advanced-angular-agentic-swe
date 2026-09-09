using System.Linq.Expressions;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Data.Sqlite;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SecretsMcp.Contracts;
using SecretsMcp.Data;
using SecretsMcp.Data.Encryption;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Repositories;

public sealed partial class AppRepository(
    IDbContextFactory<SecretsDbContext> contextFactory,
    IDbValueCipher cipher) : IAppRepository
{
    private const string OnlyInStore = "only-in-store";
    private const string OnlyInFile = "only-in-file";

    [GeneratedRegex(@"^\s*(?<key>[A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?<value>.*)$")]
    private static partial Regex EnvLine();

    private sealed record RenderRow(
        Guid? TargetId,
        string? FilePath,
        int TargetOrdinal,
        int SettingOrdinal,
        string Name,
        string KeyPath,
        string? Value,
        string? Comment);

    public async Task<IReadOnlyList<EnvironmentDto>> ListEnvironmentsAsync(CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        await MaterializeAllValuesAsync(db, cancellationToken);

        return await db.Environments
            .AsNoTracking()
            .OrderBy(e => e.Ordinal).ThenBy(e => e.Type)
            .Select(e => new EnvironmentDto(e.EnvironmentId, e.Name, e.Type, e.Ordinal))
            .ToListAsync(cancellationToken);
    }

    public async Task MaterializeEveryValueAsync(CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        await MaterializeAllValuesAsync(db, cancellationToken);
    }

    public async Task<IReadOnlyList<RepoDto>> ListReposAsync(CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        return await db.Repos
            .AsNoTracking()
            .OrderBy(r => r.Name)
            .Select(r => new RepoDto(
                r.RepoId,
                r.Name,
                r.LocalPath,
                r.RemoteUrl,
                db.Apps.Count(a => a.RepoId == r.RepoId),
                db.Settings.Count(s => s.App.RepoId == r.RepoId),
                r.LastChanged))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<DatabaseUsageDto>> ListDatabasesAsync(CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        await MaterializeAllValuesAsync(db, cancellationToken);

        var passphrase = cipher.Passphrase;

        var rows = await db.SettingValues
            .AsNoTracking()
            .Where(v => !v.IsPlaceholder && (v.Value != null || v.SecretListId != null))
            .Select(v => new
            {
                v.EnvironmentId,
                Environment = v.Environment.Type,
                v.Setting.AppId,
                AppName = v.Setting.App.Name,
                ResolvedValue = v.SecretListId == null
                    ? v.Value
                    : db.Secrets
                        .Where(s => s.ListId == v.SecretListId && s.Name == v.SecretName)
                        .OrderByDescending(s => s.Version)
                        .Select(s => SecretsDbContext.DecryptDbValue(s.PasswordCipher, passphrase))
                        .FirstOrDefault()
            })
            .ToListAsync(cancellationToken);

        var seen = new HashSet<(string Database, Guid AppId, Guid EnvironmentId)>();

        var candidates = new List<(
            string Database,
            Guid AppId,
            string AppName,
            Guid EnvironmentId,
            string Environment,
            string ConnectionString)>();

        foreach (var row in rows)
        {
            var connectionString = Blank(row.ResolvedValue);
            if (connectionString is null) continue;

            var database = ParseDatabase(connectionString);
            if (database is null) continue;

            var key = (database.ToUpperInvariant(), row.AppId, row.EnvironmentId);
            if (!seen.Add(key)) continue;

            candidates.Add((database, row.AppId, row.AppName, row.EnvironmentId, row.Environment, connectionString));
        }

        var result = new List<DatabaseUsageDto>();

        foreach (var group in candidates.GroupBy(c => ServerKey(c.ConnectionString)))
        {
            if (group.Key is null) continue;

            var names = await ProbeServerDatabasesAsync(group.First().ConnectionString, cancellationToken);

            foreach (var candidate in group)
            {
                if (!names.TryGetValue(candidate.Database, out var actualName)) continue;

                result.Add(new DatabaseUsageDto(
                    actualName, candidate.AppId, candidate.AppName, candidate.EnvironmentId, candidate.Environment));
            }
        }

        return result
            .OrderBy(d => d.Database, StringComparer.OrdinalIgnoreCase)
            .ThenBy(d => d.AppName, StringComparer.OrdinalIgnoreCase)
            .ThenBy(d => d.Environment, StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    private static string? ParseDatabase(string value)
    {
        foreach (var part in value.Split(';', StringSplitOptions.RemoveEmptyEntries))
        {
            var eq = part.IndexOf('=');
            if (eq < 0) continue;

            var key = part[..eq].Trim();
            var val = part[(eq + 1)..].Trim();
            if (val.Length == 0) continue;

            if (string.Equals(key, "Database", StringComparison.OrdinalIgnoreCase)
                || string.Equals(key, "Initial Catalog", StringComparison.OrdinalIgnoreCase))
            {
                return val;
            }
        }

        return null;
    }

    private static string? ServerKey(string connectionString)
    {
        try
        {
            var builder = new SqlConnectionStringBuilder(connectionString);
            return Blank(builder.DataSource)?.ToUpperInvariant();
        }
        catch (ArgumentException)
        {
            return null;
        }
    }

    private async Task<HashSet<string>> ProbeServerDatabasesAsync(
        string connectionString,
        CancellationToken cancellationToken)
    {
        var names = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        string dataSource;

        try
        {
            var builder = new SqlConnectionStringBuilder(connectionString);
            var source = Blank(builder.DataSource);
            if (source is null) return names;
            dataSource = source;

            builder.InitialCatalog = "master";
            builder.ConnectTimeout = 5;

            if (await TryProbeAsync(builder.ConnectionString, names, cancellationToken)) return names;
        }
        catch (ArgumentException)
        {
            return names;
        }

        var host = ExtractHost(dataSource);
        if (host is null) return names;

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var credentials = await db.BoxCredentials
            .AsNoTracking()
            .Where(c => c.Kind == BoxCredentialKind.Password && c.Box.Ipv4 == host)
            .OrderBy(c => c.Ordinal)
            .Select(c => new { c.Username, c.Value })
            .ToListAsync(cancellationToken);

        foreach (var credential in credentials)
        {
            var username = Blank(credential.Username);
            var password = Blank(credential.Value);
            if (username is null || password is null) continue;

            var boxBuilder = new SqlConnectionStringBuilder
            {
                DataSource = dataSource,
                InitialCatalog = "master",
                UserID = username,
                Password = password,
                TrustServerCertificate = true,
                Encrypt = true,
                ConnectTimeout = 5
            };

            if (await TryProbeAsync(boxBuilder.ConnectionString, names, cancellationToken)) return names;
        }

        return names;
    }

    private static async Task<bool> TryProbeAsync(
        string connectionString,
        HashSet<string> names,
        CancellationToken cancellationToken)
    {
        try
        {
            await using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync(cancellationToken);

            await using var command = connection.CreateCommand();
            command.CommandText = "SELECT name FROM sys.databases";

            await using var reader = await command.ExecuteReaderAsync(cancellationToken);

            while (await reader.ReadAsync(cancellationToken))
            {
                names.Add(reader.GetString(0));
            }

            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private static string? ExtractHost(string dataSource)
    {
        var value = dataSource.Trim();
        if (value.Length == 0) return null;

        var colon = value.IndexOf(':');
        if (colon >= 0 && value[..colon].Equals("tcp", StringComparison.OrdinalIgnoreCase))
        {
            value = value[(colon + 1)..];
        }

        var comma = value.IndexOf(',');
        if (comma >= 0) value = value[..comma];

        var backslash = value.IndexOf('\\');
        if (backslash >= 0) value = value[..backslash];

        return Blank(value);
    }

    public async Task<RepoDto> RegisterRepoAsync(RegisterRepoRequest request, CancellationToken cancellationToken)
    {
        var name = Blank(request.Name) ?? throw new ArgumentException("Name must not be empty.");

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var taken = await db.Repos.AsNoTracking().AnyAsync(r => r.Name == name, cancellationToken);

        if (taken)
        {
            throw new ArgumentException("A repository with this name already exists.");
        }

        var repo = new Repo { RepoId = Guid.CreateVersion7(), Name = name };
        db.Repos.Add(repo);

        repo.LocalPath = Blank(request.LocalPath);
        repo.RemoteUrl = Blank(request.RemoteUrl);
        repo.LastChanged = DateTime.UtcNow;

        await db.SaveChangesAsync(cancellationToken);

        var apps = await db.Apps.CountAsync(a => a.RepoId == repo.RepoId, cancellationToken);
        var settings = await db.Settings.CountAsync(s => s.App.RepoId == repo.RepoId, cancellationToken);

        return new RepoDto(repo.RepoId, repo.Name, repo.LocalPath, repo.RemoteUrl, apps, settings, repo.LastChanged);
    }

    public async Task<RepoDto?> UpdateRepoAsync(Guid repoId, UpdateRepoRequest request, CancellationToken cancellationToken)
    {
        var name = Blank(request.Name) ?? throw new ArgumentException("Name must not be empty.");

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var repo = await db.Repos.FirstOrDefaultAsync(r => r.RepoId == repoId, cancellationToken);
        if (repo is null) return null;

        var taken = await db.Repos
            .AsNoTracking()
            .AnyAsync(r => r.RepoId != repoId && r.Name == name, cancellationToken);

        if (taken)
        {
            throw new ArgumentException("A repository with this name already exists.");
        }

        repo.Name = name;
        repo.LocalPath = Blank(request.LocalPath);
        repo.RemoteUrl = Blank(request.RemoteUrl);
        repo.LastChanged = DateTime.UtcNow;

        await db.SaveChangesAsync(cancellationToken);

        var apps = await db.Apps.CountAsync(a => a.RepoId == repo.RepoId, cancellationToken);
        var settings = await db.Settings.CountAsync(s => s.App.RepoId == repo.RepoId, cancellationToken);

        return new RepoDto(repo.RepoId, repo.Name, repo.LocalPath, repo.RemoteUrl, apps, settings, repo.LastChanged);
    }

    public async Task<RepoEnvironmentDto?> GetRepoEnvironmentAsync(
        Guid repoId,
        Guid? environmentId,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var repo = await db.Repos
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.RepoId == repoId, cancellationToken);

        if (repo is null) return null;

        var environment = await ResolveEnvironmentAsync(db, environmentId, cancellationToken);
        var envId = environment.EnvironmentId;

        await MaterializeRepoValuesAsync(db, repoId, cancellationToken);

        var apps = await db.Apps
            .AsNoTracking()
            .Where(a => a.RepoId == repoId)
            .OrderBy(a => a.Ordinal).ThenBy(a => a.Name)
            .Select(a => new AppSummaryDto(
                a.AppId,
                a.Name,
                a.Kind,
                a.BoxId,
                a.Box == null ? null : a.Box.Name,
                a.Ordinal,
                a.Settings.Count,
                a.Settings.Count(s => s.Values.Any(v => v.EnvironmentId == envId && v.Value != null)),
                a.Targets
                    .Where(t => t.EnvironmentId == envId)
                    .OrderBy(t => t.Ordinal).ThenBy(t => t.FilePath)
                    .Select(t => t.FilePath)
                    .ToList(),
                a.Registration == null ? null : new AppRegistrationDto(
                    a.Registration.AppId,
                    a.Registration.DisplayName,
                    a.Registration.ClientId,
                    a.Registration.TenantId,
                    a.Registration.ObjectId,
                    a.Registration.SignInAudience,
                    a.Registration.Notes,
                    db.AppRegistrationManifests.Any(m => m.AppId == a.AppId),
                    a.Registration.LastChanged)))
            .ToListAsync(cancellationToken);

        return new RepoEnvironmentDto(repo.RepoId, repo.Name, environment.EnvironmentId, environment.Type, apps);
    }

    public async Task<ExportDto> ExportRepoAsync(
        Guid repoId,
        Guid? environmentId,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var repo = await RequireRepoAsync(db, repoId, cancellationToken);
        var environment = await ResolveEnvironmentAsync(db, environmentId, cancellationToken);

        await MaterializeRepoValuesAsync(db, repoId, cancellationToken);

        var apps = await db.Apps
            .AsNoTracking()
            .Where(a => a.RepoId == repoId)
            .OrderBy(a => a.Ordinal).ThenBy(a => a.Name)
            .Select(a => new { a.AppId, a.Name })
            .ToListAsync(cancellationToken);

        var files = new List<ExportFileDto>();

        foreach (var app in apps)
        {
            var rows = await LoadRenderRowsAsync(db, app.AppId, environment.EnvironmentId, cancellationToken);

            var targeted = rows
                .Where(r => r.FilePath is not null)
                .GroupBy(r => r.FilePath!, StringComparer.Ordinal)
                .OrderBy(g => g.Min(r => r.TargetOrdinal))
                .ThenBy(g => g.Key, StringComparer.Ordinal);

            foreach (var group in targeted)
            {
                files.Add(new ExportFileDto(app.AppId, app.Name, group.Key, Render(group)));
            }

            var loose = rows.Where(r => r.FilePath is null && r.Value is not null).ToList();

            if (loose.Count > 0)
            {
                files.Add(new ExportFileDto(app.AppId, app.Name, null, Render(loose)));
            }
        }

        return new ExportDto(repo.RepoId, repo.Name, environment.EnvironmentId, environment.Type, files);
    }

    public async Task<AppSummaryDto> CreateAppAsync(CreateAppRequest request, CancellationToken cancellationToken)
    {
        var name = Blank(request.Name) ?? throw new ArgumentException("Name must not be empty.");
        var kind = RequireKind(request.Kind);

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var repo = await RequireRepoAsync(db, request.RepoId, cancellationToken);

        var taken = await db.Apps
            .AsNoTracking()
            .AnyAsync(a => a.RepoId == repo.RepoId && a.Name == name, cancellationToken);

        if (taken)
        {
            throw new ArgumentException($"'{repo.Name}' already holds an app named '{name}'.");
        }

        var next = await db.Apps
            .Where(a => a.RepoId == repo.RepoId)
            .Select(a => (int?)a.Ordinal)
            .MaxAsync(cancellationToken) ?? 0;

        var app = new App
        {
            AppId = Guid.CreateVersion7(),
            RepoId = repo.RepoId,
            Name = name,
            Kind = kind,
            Ordinal = next + 1,
            LastChanged = DateTime.UtcNow
        };

        db.Apps.Add(app);
        await db.SaveChangesAsync(cancellationToken);

        return new AppSummaryDto(app.AppId, app.Name, app.Kind, app.BoxId, null, app.Ordinal, 0, 0, [], null);
    }

    public async Task<AppSummaryDto?> SetAppOrdinalAsync(
        Guid appId,
        int ordinal,
        Guid? environmentId,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var app = await db.Apps.FirstOrDefaultAsync(a => a.AppId == appId, cancellationToken);
        if (app is null) return null;

        var environment = await ResolveEnvironmentAsync(db, environmentId, cancellationToken);
        var envId = environment.EnvironmentId;

        app.Ordinal = ordinal;
        app.LastChanged = DateTime.UtcNow;

        await db.SaveChangesAsync(cancellationToken);

        var boxName = app.BoxId is null
            ? null
            : await db.Boxes.Where(b => b.BoxId == app.BoxId).Select(b => b.Name).FirstOrDefaultAsync(cancellationToken);
        var settingCount = await db.Settings.CountAsync(s => s.AppId == appId, cancellationToken);
        var filledCount = await db.Settings.CountAsync(
            s => s.AppId == appId && s.Values.Any(v => v.EnvironmentId == envId && v.Value != null),
            cancellationToken);
        var filePaths = await db.AppTargets
            .Where(t => t.AppId == appId && t.EnvironmentId == envId)
            .OrderBy(t => t.Ordinal).ThenBy(t => t.FilePath)
            .Select(t => t.FilePath)
            .ToListAsync(cancellationToken);
        var registration = await LoadRegistrationAsync(db, appId, cancellationToken);

        return new AppSummaryDto(app.AppId, app.Name, app.Kind, app.BoxId, boxName, app.Ordinal, settingCount, filledCount, filePaths, registration);
    }

    public async Task<AppSummaryDto?> SetAppNameAsync(
        Guid appId,
        string name,
        Guid? environmentId,
        CancellationToken cancellationToken)
    {
        var trimmed = Blank(name) ?? throw new ArgumentException("Name must not be empty.");

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var app = await db.Apps.FirstOrDefaultAsync(a => a.AppId == appId, cancellationToken);
        if (app is null) return null;

        var taken = await db.Apps
            .AsNoTracking()
            .AnyAsync(a => a.RepoId == app.RepoId && a.Name == trimmed && a.AppId != appId, cancellationToken);

        if (taken)
        {
            var repoName = await db.Repos
                .Where(r => r.RepoId == app.RepoId)
                .Select(r => r.Name)
                .FirstAsync(cancellationToken);

            throw new ArgumentException($"'{repoName}' already holds an app named '{trimmed}'.");
        }

        var environment = await ResolveEnvironmentAsync(db, environmentId, cancellationToken);
        var envId = environment.EnvironmentId;

        app.Name = trimmed;
        app.LastChanged = DateTime.UtcNow;

        await db.SaveChangesAsync(cancellationToken);

        var boxName = app.BoxId is null
            ? null
            : await db.Boxes.Where(b => b.BoxId == app.BoxId).Select(b => b.Name).FirstOrDefaultAsync(cancellationToken);
        var settingCount = await db.Settings.CountAsync(s => s.AppId == appId, cancellationToken);
        var filledCount = await db.Settings.CountAsync(
            s => s.AppId == appId && s.Values.Any(v => v.EnvironmentId == envId && v.Value != null),
            cancellationToken);
        var filePaths = await db.AppTargets
            .Where(t => t.AppId == appId && t.EnvironmentId == envId)
            .OrderBy(t => t.Ordinal).ThenBy(t => t.FilePath)
            .Select(t => t.FilePath)
            .ToListAsync(cancellationToken);
        var registration = await LoadRegistrationAsync(db, appId, cancellationToken);

        return new AppSummaryDto(app.AppId, app.Name, app.Kind, app.BoxId, boxName, app.Ordinal, settingCount, filledCount, filePaths, registration);
    }

    public async Task<AppSummaryDto?> SetAppBoxAsync(
        Guid appId,
        Guid? boxId,
        Guid? environmentId,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var app = await db.Apps.FirstOrDefaultAsync(a => a.AppId == appId, cancellationToken);
        if (app is null) return null;

        string? boxName = null;

        if (boxId is not null)
        {
            boxName = await db.Boxes.Where(b => b.BoxId == boxId).Select(b => b.Name).FirstOrDefaultAsync(cancellationToken);
            if (boxName is null) return null;
        }

        var environment = await ResolveEnvironmentAsync(db, environmentId, cancellationToken);
        var envId = environment.EnvironmentId;

        app.BoxId = boxId;
        app.LastChanged = DateTime.UtcNow;

        await db.SaveChangesAsync(cancellationToken);

        var settingCount = await db.Settings.CountAsync(s => s.AppId == appId, cancellationToken);
        var filledCount = await db.Settings.CountAsync(
            s => s.AppId == appId && s.Values.Any(v => v.EnvironmentId == envId && v.Value != null),
            cancellationToken);
        var filePaths = await db.AppTargets
            .Where(t => t.AppId == appId && t.EnvironmentId == envId)
            .OrderBy(t => t.Ordinal).ThenBy(t => t.FilePath)
            .Select(t => t.FilePath)
            .ToListAsync(cancellationToken);
        var registration = await LoadRegistrationAsync(db, appId, cancellationToken);

        return new AppSummaryDto(app.AppId, app.Name, app.Kind, app.BoxId, boxName, app.Ordinal, settingCount, filledCount, filePaths, registration);
    }

    public async Task<AppSummaryDto?> SetAppRegistrationAsync(
        Guid appId,
        SetAppRegistrationRequest request,
        Guid? environmentId,
        CancellationToken cancellationToken)
    {
        var displayName = Blank(request.DisplayName) ?? throw new ArgumentException("DisplayName must not be empty.");

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var app = await db.Apps.FirstOrDefaultAsync(a => a.AppId == appId, cancellationToken);
        if (app is null) return null;

        var registration = await db.AppRegistrations.FirstOrDefaultAsync(r => r.AppId == appId, cancellationToken);
        var now = DateTime.UtcNow;

        if (registration is null)
        {
            registration = new AppRegistration { AppId = appId };
            db.AppRegistrations.Add(registration);
        }

        registration.DisplayName = displayName;
        registration.ClientId = request.ClientId;
        registration.TenantId = request.TenantId;
        registration.ObjectId = request.ObjectId;
        registration.SignInAudience = Blank(request.SignInAudience);
        registration.Notes = Blank(request.Notes);
        registration.LastChanged = now;

        await db.SaveChangesAsync(cancellationToken);

        return await LoadAppSummaryAsync(db, app, environmentId, cancellationToken);
    }

    public async Task<bool> DeleteAppRegistrationAsync(Guid appId, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var registration = await db.AppRegistrations.FirstOrDefaultAsync(r => r.AppId == appId, cancellationToken);
        if (registration is null) return false;

        db.AppRegistrations.Remove(registration);
        await db.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<AppRegistrationDto?> SetAppRegistrationManifestAsync(
        Guid appId,
        string fileName,
        string contentType,
        byte[] content,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var registration = await db.AppRegistrations.FirstOrDefaultAsync(r => r.AppId == appId, cancellationToken);
        if (registration is null) return null;

        var manifest = await db.AppRegistrationManifests.FirstOrDefaultAsync(m => m.AppId == appId, cancellationToken);
        var now = DateTime.UtcNow;

        if (manifest is null)
        {
            manifest = new AppRegistrationManifest { AppId = appId };
            db.AppRegistrationManifests.Add(manifest);
        }

        manifest.FileName = fileName;
        manifest.ContentType = string.IsNullOrWhiteSpace(contentType) ? "application/octet-stream" : contentType;
        manifest.ByteSize = content.LongLength;
        manifest.Content = content;
        manifest.UploadedAt = now;

        await db.SaveChangesAsync(cancellationToken);

        return new AppRegistrationDto(
            registration.AppId,
            registration.DisplayName,
            registration.ClientId,
            registration.TenantId,
            registration.ObjectId,
            registration.SignInAudience,
            registration.Notes,
            true,
            registration.LastChanged);
    }

    public async Task<AppRegistrationManifest?> GetAppRegistrationManifestAsync(Guid appId, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        return await db.AppRegistrationManifests
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.AppId == appId, cancellationToken);
    }

    public async Task<AppSettingsDto?> GetAppSettingsAsync(
        Guid appId,
        Guid? environmentId,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var app = await db.Apps
            .AsNoTracking()
            .Where(a => a.AppId == appId)
            .Select(a => new { a.AppId, a.RepoId, a.Name, a.Kind })
            .FirstOrDefaultAsync(cancellationToken);

        if (app is null) return null;

        var environment = await ResolveEnvironmentAsync(db, environmentId, cancellationToken);
        var envId = environment.EnvironmentId;

        await MaterializeAppValuesAsync(db, appId, cancellationToken);

        var targets = await db.AppTargets
            .AsNoTracking()
            .Where(t => t.AppId == appId && t.EnvironmentId == envId)
            .OrderBy(t => t.Ordinal).ThenBy(t => t.FilePath)
            .Select(t => new AppTargetDto(t.TargetId, t.EnvironmentId, t.FilePath, t.Ordinal))
            .ToListAsync(cancellationToken);

        var settings = await LoadSettingRowsAsync(db, s => s.AppId == appId, environment, cancellationToken);

        return new AppSettingsDto(
            app.AppId,
            app.RepoId,
            app.Name,
            app.Kind,
            environment.EnvironmentId,
            environment.Type,
            targets,
            settings);
    }

    public async Task<AppTargetDto> SetAppTargetAsync(
        Guid appId,
        Guid environmentId,
        string filePath,
        CancellationToken cancellationToken)
    {
        var path = RequireFilePath(filePath);

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var app = await RequireAppAsync(db, appId, cancellationToken);
        var environment = await RequireEnvironmentAsync(db, environmentId, cancellationToken);
        var target = await RequireTargetAsync(db, app.AppId, environment.EnvironmentId, path, cancellationToken);

        await db.SaveChangesAsync(cancellationToken);

        return new AppTargetDto(target.TargetId, target.EnvironmentId, target.FilePath, target.Ordinal);
    }

    public async Task<SettingRowDto> CreateSettingAsync(
        Guid appId,
        CreateSettingRequest request,
        CancellationToken cancellationToken)
    {
        var name = RequireName(request.Name);
        var comment = RequireComment(request.Comment);

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var app = await RequireAppAsync(db, appId, cancellationToken);

        var taken = await db.Settings
            .AsNoTracking()
            .AnyAsync(s => s.AppId == app.AppId && s.Name == name, cancellationToken);

        if (taken)
        {
            throw new ArgumentException($"'{app.Name}' already declares a setting named '{name}'.");
        }

        var next = await db.Settings
            .Where(s => s.AppId == app.AppId)
            .Select(s => (int?)s.Ordinal)
            .MaxAsync(cancellationToken) ?? 0;

        var now = DateTime.UtcNow;

        var setting = new Setting
        {
            SettingId = Guid.CreateVersion7(),
            AppId = app.AppId,
            Name = name,
            IsSecret = request.IsSecret,
            Comment = comment,
            Ordinal = request.Ordinal ?? next + 1,
            LastChanged = now
        };

        db.Settings.Add(setting);

        var environmentIds = await db.Environments
            .AsNoTracking()
            .Select(e => e.EnvironmentId)
            .ToListAsync(cancellationToken);

        foreach (var environmentId in environmentIds)
        {
            db.SettingValues.Add(new SettingValue
            {
                SettingId = setting.SettingId,
                EnvironmentId = environmentId,
                KeyPath = setting.Name,
                IsPlaceholder = false,
                LastChanged = now
            });
        }

        await db.SaveChangesAsync(cancellationToken);

        var environment = await FirstEnvironmentAsync(db, cancellationToken);

        return await RequireSettingRowAsync(db, setting.SettingId, environment, cancellationToken);
    }

    public async Task<bool> DeleteSettingAsync(Guid settingId, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var setting = await db.Settings.FirstOrDefaultAsync(s => s.SettingId == settingId, cancellationToken);

        if (setting is null) return false;

        await using var tx = await db.Database.BeginTransactionAsync(cancellationToken);

        await db.SettingValues
            .Where(v => v.SettingId == settingId)
            .ExecuteDeleteAsync(cancellationToken);

        db.Settings.Remove(setting);
        await db.SaveChangesAsync(cancellationToken);

        await tx.CommitAsync(cancellationToken);

        return true;
    }

    public async Task<SettingRowDto> SetSettingValueAsync(
        Guid settingId,
        Guid environmentId,
        SetSettingValueRequest request,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var setting = await RequireSettingAsync(db, settingId, cancellationToken);
        var environment = await RequireEnvironmentAsync(db, environmentId, cancellationToken);

        await MaterializeAppValuesAsync(db, setting.AppId, cancellationToken);

        var value = await RequireValueAsync(db, setting, environment.EnvironmentId, cancellationToken);
        var targetId = await ResolveTargetIdAsync(
            db, setting.AppId, environment.EnvironmentId, request.TargetId, cancellationToken);

        value.KeyPath = Blank(request.KeyPath) is { } keyPath ? RequireKeyPath(keyPath) : setting.Name;
        value.Value = Blank(request.Value);
        value.IsPlaceholder = request.IsPlaceholder;
        value.TargetId = targetId;
        value.LastChanged = DateTime.UtcNow;

        setting.LastChanged = value.LastChanged;

        await db.SaveChangesAsync(cancellationToken);

        return await RequireSettingRowAsync(db, setting.SettingId, environment, cancellationToken);
    }

    public async Task<string> RenderAsync(
        Guid appId,
        Guid environmentId,
        string? filePath,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var app = await RequireAppAsync(db, appId, cancellationToken);
        var environment = await RequireEnvironmentAsync(db, environmentId, cancellationToken);

        await MaterializeAppValuesAsync(db, app.AppId, cancellationToken);

        var rows = await LoadRenderRowsAsync(db, app.AppId, environment.EnvironmentId, cancellationToken);
        var path = Blank(filePath);

        if (path is not null)
        {
            rows = rows
                .Where(r => string.Equals(r.FilePath, path, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        return Render(rows);
    }

    public async Task<int> ImportAsync(Guid appId, ImportRequest request, CancellationToken cancellationToken)
    {
        var path = RequireFilePath(request.FilePath);

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var app = await RequireAppAsync(db, appId, cancellationToken);
        var environment = await RequireEnvironmentAsync(db, request.EnvironmentId, cancellationToken);

        await MaterializeAppValuesAsync(db, app.AppId, cancellationToken);

        var target = await RequireTargetAsync(db, app.AppId, environment.EnvironmentId, path, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);

        var now = DateTime.UtcNow;

        if (request.Replace)
        {
            var stale = await db.SettingValues
                .Include(v => v.Setting)
                .Where(v => v.EnvironmentId == environment.EnvironmentId && v.TargetId == target.TargetId)
                .ToListAsync(cancellationToken);

            foreach (var row in stale)
            {
                row.TargetId = null;
                row.KeyPath = row.Setting.Name;
                row.Value = null;
                row.IsPlaceholder = false;
                row.SecretListId = null;
                row.SecretName = null;
                row.LastChanged = now;
            }

            await db.SaveChangesAsync(cancellationToken);
        }

        var settings = await db.Settings
            .Where(s => s.AppId == app.AppId)
            .ToDictionaryAsync(s => s.Name, s => s, StringComparer.OrdinalIgnoreCase, cancellationToken);

        var values = await db.SettingValues
            .Where(v => v.EnvironmentId == environment.EnvironmentId && v.Setting.AppId == app.AppId)
            .ToDictionaryAsync(v => v.SettingId, v => v, cancellationToken);

        var environmentIds = await db.Environments
            .AsNoTracking()
            .Select(e => e.EnvironmentId)
            .ToListAsync(cancellationToken);

        var parsed = Parse(request.Content);
        var ordinal = 0;

        foreach (var (key, value, _, comment) in parsed)
        {
            ordinal++;

            var name = CanonicalName(key);

            if (!settings.TryGetValue(name, out var setting))
            {
                setting = new Setting
                {
                    SettingId = Guid.CreateVersion7(),
                    AppId = app.AppId,
                    Name = name,
                    IsSecret = true
                };

                db.Settings.Add(setting);
                settings[name] = setting;

                foreach (var id in environmentIds)
                {
                    var materialized = new SettingValue
                    {
                        SettingId = setting.SettingId,
                        EnvironmentId = id,
                        KeyPath = name,
                        IsPlaceholder = false,
                        LastChanged = now
                    };

                    db.SettingValues.Add(materialized);

                    if (id == environment.EnvironmentId)
                    {
                        values[setting.SettingId] = materialized;
                    }
                }
            }

            setting.Comment = comment ?? setting.Comment;
            setting.Ordinal = ordinal;
            setting.LastChanged = now;

            var current = values[setting.SettingId];
            current.KeyPath = key;
            current.Value = value;
            current.IsPlaceholder = value is not null && value.Contains('<') && value.Contains('>');
            current.TargetId = target.TargetId;
            current.LastChanged = now;
        }

        await db.SaveChangesAsync(cancellationToken);

        return parsed.Count;
    }

    public async Task<DiffDto> DiffAsync(Guid appId, DiffRequest request, CancellationToken cancellationToken)
    {
        var path = RequireFilePath(request.FilePath);

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var app = await RequireAppAsync(db, appId, cancellationToken);
        var environment = await RequireEnvironmentAsync(db, request.EnvironmentId, cancellationToken);

        var target = await db.AppTargets
            .AsNoTracking()
            .FirstOrDefaultAsync(
                t => t.AppId == app.AppId && t.EnvironmentId == environment.EnvironmentId && t.FilePath == path,
                cancellationToken);

        List<string> storeKeys = target is null
            ? []
            : await db.SettingValues
                .AsNoTracking()
                .Where(v => v.EnvironmentId == environment.EnvironmentId && v.TargetId == target.TargetId)
                .Select(v => v.KeyPath)
                .ToListAsync(cancellationToken);

        var store = storeKeys.ToHashSet(StringComparer.Ordinal);
        var uploaded = Parse(request.Content).Select(p => p.Key).ToHashSet(StringComparer.Ordinal);

        var rows = new List<DiffRowDto>();

        foreach (var key in store.Except(uploaded).Order(StringComparer.Ordinal))
        {
            rows.Add(new DiffRowDto(
                environment.EnvironmentId, environment.Type, path, key, OnlyInStore, "the file is missing this key"));
        }

        foreach (var key in uploaded.Except(store).Order(StringComparer.Ordinal))
        {
            rows.Add(new DiffRowDto(
                environment.EnvironmentId, environment.Type, path, key, OnlyInFile, "the store has never seen this key"));
        }

        return new DiffDto(
            app.AppId,
            environment.EnvironmentId,
            environment.Type,
            path,
            store.Count,
            uploaded.Count,
            store.Intersect(uploaded).Count(),
            rows);
    }

    private static async Task<AppRegistrationDto?> LoadRegistrationAsync(
        SecretsDbContext db,
        Guid appId,
        CancellationToken cancellationToken)
    {
        return await db.AppRegistrations
            .AsNoTracking()
            .Where(r => r.AppId == appId)
            .Select(r => new AppRegistrationDto(
                r.AppId,
                r.DisplayName,
                r.ClientId,
                r.TenantId,
                r.ObjectId,
                r.SignInAudience,
                r.Notes,
                db.AppRegistrationManifests.Any(m => m.AppId == appId),
                r.LastChanged))
            .FirstOrDefaultAsync(cancellationToken);
    }

    private static async Task<AppSummaryDto> LoadAppSummaryAsync(
        SecretsDbContext db,
        App app,
        Guid? environmentId,
        CancellationToken cancellationToken)
    {
        var environment = await ResolveEnvironmentAsync(db, environmentId, cancellationToken);
        var envId = environment.EnvironmentId;

        var boxName = app.BoxId is null
            ? null
            : await db.Boxes.Where(b => b.BoxId == app.BoxId).Select(b => b.Name).FirstOrDefaultAsync(cancellationToken);
        var settingCount = await db.Settings.CountAsync(s => s.AppId == app.AppId, cancellationToken);
        var filledCount = await db.Settings.CountAsync(
            s => s.AppId == app.AppId && s.Values.Any(v => v.EnvironmentId == envId && v.Value != null),
            cancellationToken);
        var filePaths = await db.AppTargets
            .Where(t => t.AppId == app.AppId && t.EnvironmentId == envId)
            .OrderBy(t => t.Ordinal).ThenBy(t => t.FilePath)
            .Select(t => t.FilePath)
            .ToListAsync(cancellationToken);
        var registration = await LoadRegistrationAsync(db, app.AppId, cancellationToken);

        return new AppSummaryDto(app.AppId, app.Name, app.Kind, app.BoxId, boxName, app.Ordinal, settingCount, filledCount, filePaths, registration);
    }

    private static async Task<IReadOnlyList<SettingRowDto>> LoadSettingRowsAsync(
        SecretsDbContext db,
        Expression<Func<Setting, bool>> predicate,
        DeploymentEnvironment environment,
        CancellationToken cancellationToken)
    {
        var rows = await db.Settings
            .AsNoTracking()
            .Where(predicate)
            .OrderBy(s => s.Ordinal).ThenBy(s => s.Name)
            .Select(s => new
            {
                s.SettingId,
                s.Name,
                s.IsSecret,
                s.Comment,
                s.Ordinal,
                Values = s.Values
                    .OrderBy(v => v.Environment.Ordinal)
                    .Select(v => new
                    {
                        v.EnvironmentId,
                        Environment = v.Environment.Type,
                        v.KeyPath,
                        v.Value,
                        v.IsPlaceholder,
                        v.SecretListId,
                        v.SecretName,
                        v.TargetId,
                        FilePath = v.Target == null ? null : v.Target.FilePath
                    })
                    .ToList()
            })
            .ToListAsync(cancellationToken);

        return rows
            .Select(s =>
            {
                var all = s.Values
                    .Select(v => new SettingValueDto(
                        v.EnvironmentId,
                        v.Environment,
                        v.KeyPath,
                        v.Value,
                        v.IsPlaceholder,
                        v.SecretListId,
                        v.SecretName))
                    .ToList();

                var current = s.Values.FirstOrDefault(v => v.EnvironmentId == environment.EnvironmentId);

                var value = current is null
                    ? new SettingValueDto(environment.EnvironmentId, environment.Type, s.Name, null, false, null, null)
                    : new SettingValueDto(
                        current.EnvironmentId,
                        current.Environment,
                        current.KeyPath,
                        current.Value,
                        current.IsPlaceholder,
                        current.SecretListId,
                        current.SecretName);

                return new SettingRowDto(
                    s.SettingId,
                    s.Name,
                    s.IsSecret,
                    s.Comment,
                    s.Ordinal,
                    current?.TargetId,
                    current?.FilePath,
                    value,
                    all);
            })
            .ToList();
    }

    private static async Task<SettingRowDto> RequireSettingRowAsync(
        SecretsDbContext db,
        Guid settingId,
        DeploymentEnvironment environment,
        CancellationToken cancellationToken)
    {
        var rows = await LoadSettingRowsAsync(db, s => s.SettingId == settingId, environment, cancellationToken);

        return rows.Count == 1
            ? rows[0]
            : throw new ArgumentException($"Unknown setting '{settingId}'.");
    }

    private static async Task<List<RenderRow>> LoadRenderRowsAsync(
        SecretsDbContext db,
        Guid appId,
        Guid environmentId,
        CancellationToken cancellationToken)
    {
        var rows = await db.SettingValues
            .AsNoTracking()
            .Where(v => v.EnvironmentId == environmentId && v.Setting.AppId == appId)
            .Select(v => new
            {
                v.TargetId,
                FilePath = v.Target == null ? null : v.Target.FilePath,
                TargetOrdinal = v.Target == null ? int.MaxValue : v.Target.Ordinal,
                v.Setting.Ordinal,
                v.Setting.Name,
                v.KeyPath,
                v.Value,
                v.Setting.Comment
            })
            .ToListAsync(cancellationToken);

        return rows
            .Select(r => new RenderRow(
                r.TargetId, r.FilePath, r.TargetOrdinal, r.Ordinal, r.Name, r.KeyPath, r.Value, r.Comment))
            .ToList();
    }

    private static string Render(IEnumerable<RenderRow> rows)
    {
        var ordered = rows
            .OrderBy(r => r.TargetOrdinal)
            .ThenBy(r => r.FilePath, StringComparer.Ordinal)
            .ThenBy(r => r.SettingOrdinal)
            .ThenBy(r => r.Name, StringComparer.Ordinal)
            .ToList();

        var sb = new StringBuilder();
        string? section = null;
        var sectioned = false;

        foreach (var row in ordered)
        {
            if (!sectioned || !string.Equals(row.FilePath, section, StringComparison.Ordinal))
            {
                section = row.FilePath;
                sectioned = true;

                if (sb.Length > 0) sb.Append('\n');
                if (section is not null) sb.Append("# --- ").Append(section).Append(" ---\n");
            }

            if (row.Comment is { Length: > 0 })
            {
                foreach (var line in row.Comment.Split('\n'))
                {
                    sb.Append("# ").Append(line.TrimEnd()).Append('\n');
                }
            }

            sb.Append(row.KeyPath).Append('=').Append(row.Value ?? "").Append('\n');
        }

        return sb.ToString();
    }

    private static async Task MaterializeRepoValuesAsync(
        SecretsDbContext db,
        Guid repoId,
        CancellationToken cancellationToken)
    {
        await MaterializeMissingAsync(
            db,
            $"""
            INSERT INTO [SettingValues] ([SettingId], [EnvironmentId], [KeyPath], [IsPlaceholder], [LastChanged])
            SELECT s.[SettingId], e.[EnvironmentId], s.[Name], 0, {DateTime.UtcNow}
            FROM [Settings] s
            JOIN [Apps] a ON a.[AppId] = s.[AppId]
            CROSS JOIN [Environments] e
            WHERE a.[RepoId] = {repoId}
              AND NOT EXISTS (
                  SELECT 1 FROM [SettingValues] sv
                  WHERE sv.[SettingId] = s.[SettingId] AND sv.[EnvironmentId] = e.[EnvironmentId]);
            """,
            cancellationToken);
    }

    private static async Task MaterializeAppValuesAsync(
        SecretsDbContext db,
        Guid appId,
        CancellationToken cancellationToken)
    {
        await MaterializeMissingAsync(
            db,
            $"""
            INSERT INTO [SettingValues] ([SettingId], [EnvironmentId], [KeyPath], [IsPlaceholder], [LastChanged])
            SELECT s.[SettingId], e.[EnvironmentId], s.[Name], 0, {DateTime.UtcNow}
            FROM [Settings] s
            CROSS JOIN [Environments] e
            WHERE s.[AppId] = {appId}
              AND NOT EXISTS (
                  SELECT 1 FROM [SettingValues] sv
                  WHERE sv.[SettingId] = s.[SettingId] AND sv.[EnvironmentId] = e.[EnvironmentId]);
            """,
            cancellationToken);
    }

    private static async Task MaterializeAllValuesAsync(
        SecretsDbContext db,
        CancellationToken cancellationToken)
    {
        await MaterializeMissingAsync(
            db,
            $"""
            INSERT INTO [SettingValues] ([SettingId], [EnvironmentId], [KeyPath], [IsPlaceholder], [LastChanged])
            SELECT s.[SettingId], e.[EnvironmentId], s.[Name], 0, {DateTime.UtcNow}
            FROM [Settings] s
            CROSS JOIN [Environments] e
            WHERE NOT EXISTS (
                  SELECT 1 FROM [SettingValues] sv
                  WHERE sv.[SettingId] = s.[SettingId] AND sv.[EnvironmentId] = e.[EnvironmentId]);
            """,
            cancellationToken);
    }

    private static async Task MaterializeMissingAsync(
        SecretsDbContext db,
        FormattableString sql,
        CancellationToken cancellationToken)
    {
        try
        {
            await db.Database.ExecuteSqlInterpolatedAsync(sql, cancellationToken);
        }
        catch (SqliteException ex) when (ex.SqliteErrorCode == 19)
        {
        }
    }

    private static async Task<SettingValue> RequireValueAsync(
        SecretsDbContext db,
        Setting setting,
        Guid environmentId,
        CancellationToken cancellationToken)
    {
        var value = await db.SettingValues
            .FirstOrDefaultAsync(
                v => v.SettingId == setting.SettingId && v.EnvironmentId == environmentId,
                cancellationToken);

        if (value is null)
        {
            value = new SettingValue
            {
                SettingId = setting.SettingId,
                EnvironmentId = environmentId,
                KeyPath = setting.Name,
                IsPlaceholder = false,
                LastChanged = DateTime.UtcNow
            };

            db.SettingValues.Add(value);
        }

        return value;
    }

    private static async Task<Guid?> ResolveTargetIdAsync(
        SecretsDbContext db,
        Guid appId,
        Guid environmentId,
        Guid? targetId,
        CancellationToken cancellationToken)
    {
        if (targetId is not { } id) return null;

        var known = await db.AppTargets
            .AsNoTracking()
            .AnyAsync(
                t => t.TargetId == id && t.AppId == appId && t.EnvironmentId == environmentId,
                cancellationToken);

        return known
            ? id
            : throw new ArgumentException($"Target '{id}' does not belong to this app in this environment.");
    }

    private static async Task<AppTarget> RequireTargetAsync(
        SecretsDbContext db,
        Guid appId,
        Guid environmentId,
        string filePath,
        CancellationToken cancellationToken)
    {
        var target = await db.AppTargets
            .FirstOrDefaultAsync(
                t => t.AppId == appId && t.EnvironmentId == environmentId && t.FilePath == filePath,
                cancellationToken);

        if (target is not null) return target;

        var next = await db.AppTargets
            .Where(t => t.AppId == appId && t.EnvironmentId == environmentId)
            .Select(t => (int?)t.Ordinal)
            .MaxAsync(cancellationToken) ?? 0;

        target = new AppTarget
        {
            TargetId = Guid.CreateVersion7(),
            AppId = appId,
            EnvironmentId = environmentId,
            FilePath = filePath,
            Ordinal = next + 1
        };

        db.AppTargets.Add(target);

        return target;
    }

    private static async Task<Repo> RequireRepoAsync(
        SecretsDbContext db,
        Guid repoId,
        CancellationToken cancellationToken)
    {
        return await db.Repos.FirstOrDefaultAsync(r => r.RepoId == repoId, cancellationToken)
            ?? throw new ArgumentException($"Unknown repository '{repoId}'. Register it first.");
    }

    private static async Task<App> RequireAppAsync(
        SecretsDbContext db,
        Guid appId,
        CancellationToken cancellationToken)
    {
        return await db.Apps.FirstOrDefaultAsync(a => a.AppId == appId, cancellationToken)
            ?? throw new ArgumentException($"Unknown app '{appId}'.");
    }

    private static async Task<Setting> RequireSettingAsync(
        SecretsDbContext db,
        Guid settingId,
        CancellationToken cancellationToken)
    {
        return await db.Settings.FirstOrDefaultAsync(s => s.SettingId == settingId, cancellationToken)
            ?? throw new ArgumentException($"Unknown setting '{settingId}'.");
    }

    private static async Task<DeploymentEnvironment> ResolveEnvironmentAsync(
        SecretsDbContext db,
        Guid? environmentId,
        CancellationToken cancellationToken)
    {
        return environmentId is { } id
            ? await RequireEnvironmentAsync(db, id, cancellationToken)
            : await FirstEnvironmentAsync(db, cancellationToken);
    }

    private static async Task<DeploymentEnvironment> RequireEnvironmentAsync(
        SecretsDbContext db,
        Guid environmentId,
        CancellationToken cancellationToken)
    {
        return await db.Environments
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.EnvironmentId == environmentId, cancellationToken)
            ?? throw new ArgumentException($"Unknown environment '{environmentId}'.");
    }

    private static async Task<DeploymentEnvironment> FirstEnvironmentAsync(
        SecretsDbContext db,
        CancellationToken cancellationToken)
    {
        return await db.Environments
            .AsNoTracking()
            .OrderBy(e => e.Ordinal).ThenBy(e => e.Type)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new ArgumentException("The store holds no environments.");
    }

    private static List<(string Key, string? Value, string? Section, string? Comment)> Parse(string content)
    {
        var result = new List<(string, string?, string?, string?)>();
        string? section = null;
        var comment = new List<string>();

        foreach (var raw in (content ?? "").Replace("\r\n", "\n").Split('\n'))
        {
            var line = raw.TrimEnd();

            if (line.StartsWith("# ---", StringComparison.Ordinal))
            {
                section = line.Trim('#', ' ', '-');
                comment.Clear();
                continue;
            }

            if (line.StartsWith('#'))
            {
                comment.Add(line.TrimStart('#', ' '));
                continue;
            }

            if (line.Length == 0)
            {
                comment.Clear();
                continue;
            }

            var match = EnvLine().Match(line);
            if (!match.Success) continue;

            var value = match.Groups["value"].Value.Trim();
            if (value.Length > 1 && value[0] == '"' && value[^1] == '"') value = value[1..^1];
            else if (value.Length > 1 && value[0] == '\'' && value[^1] == '\'') value = value[1..^1];

            result.Add((
                match.Groups["key"].Value,
                value.Length == 0 ? null : value,
                section,
                comment.Count == 0 ? null : string.Join('\n', comment.TakeLast(2))));

            comment.Clear();
        }

        return result;
    }

    private static string CanonicalName(string key) => key.Replace("__", ":");

    private static string? Blank(string? value)
    {
        var trimmed = (value ?? "").Trim();
        return trimmed.Length == 0 ? null : trimmed;
    }

    private static string RequireKind(string? kind)
    {
        var value = Blank(kind)?.ToLowerInvariant() ?? AppKind.App;

        if (!AppKind.IsKnown(value))
        {
            throw new ArgumentException($"Unknown app kind '{kind}'. Known kinds: {string.Join(", ", AppKind.All)}.");
        }

        return value;
    }

    private static string RequireFilePath(string? filePath)
    {
        return Blank(filePath) ?? throw new ArgumentException("FilePath must not be empty.");
    }

    private static string RequireName(string? name)
    {
        var value = Blank(name) ?? throw new ArgumentException("Name must not be empty.");

        if (value.Any(char.IsWhiteSpace) || value.Contains('='))
        {
            throw new ArgumentException($"'{name}' is not a valid setting name.");
        }

        return value;
    }

    private static string RequireKeyPath(string keyPath)
    {
        var value = keyPath.Trim();

        if (value.Any(char.IsWhiteSpace) || value.Contains('='))
        {
            throw new ArgumentException($"'{keyPath}' is not a valid key path.");
        }

        return value;
    }

    private static string? RequireComment(string? comment)
    {
        var value = Blank(comment);
        if (value is null) return null;

        var lines = value.Replace("\r\n", "\n").Split('\n');

        if (lines.Length > 2)
        {
            throw new ArgumentException($"A comment is at most two lines; this one has {lines.Length}.");
        }

        return string.Join('\n', lines);
    }
}
