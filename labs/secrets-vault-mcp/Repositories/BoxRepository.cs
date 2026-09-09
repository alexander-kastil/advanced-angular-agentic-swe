using Microsoft.EntityFrameworkCore;
using SecretsMcp.Contracts;
using SecretsMcp.Data;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Repositories;

public sealed class BoxRepository(IDbContextFactory<SecretsDbContext> contextFactory) : IBoxRepository
{
    public async Task<IReadOnlyList<BoxDto>> ListAsync(CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        return await db.Boxes
            .AsNoTracking()
            .OrderBy(b => b.Ordinal).ThenBy(b => b.Name)
            .Select(b => new BoxDto(
                b.BoxId,
                b.Name,
                b.Provider,
                b.ServerId,
                b.Ipv4,
                b.Ipv6,
                b.ServerType,
                b.Location,
                b.Hostname,
                b.Role,
                b.Credentials.Count,
                b.Apps.Count,
                b.Ordinal,
                b.LastChanged,
                b.Apps
                    .OrderBy(a => a.Ordinal)
                    .Select(a => a.Name)
                    .ToList()))
            .ToListAsync(cancellationToken);
    }

    public async Task<BoxDetailDto?> GetByIdAsync(Guid boxId, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        return await LoadDetailAsync(db, boxId, cancellationToken);
    }

    public async Task<BoxDetailDto> CreateAsync(UpsertBoxRequest request, CancellationToken cancellationToken)
    {
        var name = Blank(request.Name) ?? throw new ArgumentException("Name must not be empty.");

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        if (await db.Boxes.AnyAsync(b => b.Name == name, cancellationToken))
        {
            throw new ArgumentException($"A box named '{name}' already exists.");
        }

        var next = await db.Boxes.Select(b => (int?)b.Ordinal).MaxAsync(cancellationToken) ?? 0;
        var now = DateTime.UtcNow;

        var box = new Box
        {
            BoxId = Guid.CreateVersion7(),
            Name = name,
            Provider = Blank(request.Provider) ?? "hetzner-cloud",
            ServerId = request.ServerId,
            Ipv4 = Blank(request.Ipv4),
            Ipv6 = Blank(request.Ipv6),
            ServerType = Blank(request.ServerType),
            Location = Blank(request.Location),
            Hostname = Blank(request.Hostname),
            Role = Blank(request.Role),
            SshUser = Blank(request.SshUser),
            SshKeyPath = Blank(request.SshKeyPath),
            SshKeyName = Blank(request.SshKeyName),
            StackDir = Blank(request.StackDir),
            EdgeDir = Blank(request.EdgeDir),
            EdgeContainer = Blank(request.EdgeContainer),
            DockerNetwork = Blank(request.DockerNetwork),
            PortBand = Blank(request.PortBand),
            ComposePath = Blank(request.ComposePath),
            EnvDir = Blank(request.EnvDir),
            Notes = Blank(request.Notes),
            Ordinal = request.Ordinal ?? next + 1,
            LastChanged = now
        };

        db.Boxes.Add(box);
        await db.SaveChangesAsync(cancellationToken);

        return ToDetailDto(box, [], []);
    }

    public async Task<BoxDetailDto?> UpdateAsync(
        Guid boxId, UpsertBoxRequest request, CancellationToken cancellationToken)
    {
        var name = Blank(request.Name) ?? throw new ArgumentException("Name must not be empty.");

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var box = await db.Boxes.FirstOrDefaultAsync(b => b.BoxId == boxId, cancellationToken);
        if (box is null) return null;

        if (!string.Equals(box.Name, name, StringComparison.Ordinal) &&
            await db.Boxes.AnyAsync(b => b.Name == name && b.BoxId != boxId, cancellationToken))
        {
            throw new ArgumentException($"A box named '{name}' already exists.");
        }

        box.Name = name;
        box.Provider = Blank(request.Provider) ?? "hetzner-cloud";
        box.ServerId = request.ServerId;
        box.Ipv4 = Blank(request.Ipv4);
        box.Ipv6 = Blank(request.Ipv6);
        box.ServerType = Blank(request.ServerType);
        box.Location = Blank(request.Location);
        box.Hostname = Blank(request.Hostname);
        box.Role = Blank(request.Role);
        box.SshUser = Blank(request.SshUser);
        box.SshKeyPath = Blank(request.SshKeyPath);
        box.SshKeyName = Blank(request.SshKeyName);
        box.StackDir = Blank(request.StackDir);
        box.EdgeDir = Blank(request.EdgeDir);
        box.EdgeContainer = Blank(request.EdgeContainer);
        box.DockerNetwork = Blank(request.DockerNetwork);
        box.PortBand = Blank(request.PortBand);
        box.ComposePath = Blank(request.ComposePath);
        box.EnvDir = Blank(request.EnvDir);
        box.Notes = Blank(request.Notes);
        box.Ordinal = request.Ordinal ?? box.Ordinal;
        box.LastChanged = DateTime.UtcNow;

        await db.SaveChangesAsync(cancellationToken);

        return await LoadDetailAsync(db, boxId, cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid boxId, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var box = await db.Boxes.FirstOrDefaultAsync(b => b.BoxId == boxId, cancellationToken);
        if (box is null) return false;

        db.Boxes.Remove(box);
        await db.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<BoxCredentialDto> CreateCredentialAsync(
        Guid boxId, UpsertBoxCredentialRequest request, CancellationToken cancellationToken)
    {
        var kind = RequireCredentialKind(request.Kind);
        var label = Blank(request.Label) ?? throw new ArgumentException("Label must not be empty.");

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var box = await RequireBoxAsync(db, boxId, cancellationToken);

        if (await db.BoxCredentials.AnyAsync(c => c.BoxId == box.BoxId && c.Label == label, cancellationToken))
        {
            throw new ArgumentException($"'{box.Name}' already holds a credential labeled '{label}'.");
        }

        var next = await db.BoxCredentials
            .Where(c => c.BoxId == box.BoxId)
            .Select(c => (int?)c.Ordinal)
            .MaxAsync(cancellationToken) ?? 0;

        var now = DateTime.UtcNow;

        var credential = new BoxCredential
        {
            CredentialId = Guid.CreateVersion7(),
            BoxId = box.BoxId,
            Kind = kind,
            Label = label,
            Username = Blank(request.Username),
            Value = Blank(request.Value),
            KeyPath = Blank(request.KeyPath),
            Fingerprint = Blank(request.Fingerprint),
            Comment = Blank(request.Comment),
            Ordinal = request.Ordinal ?? next + 1,
            LastChanged = now
        };

        db.BoxCredentials.Add(credential);
        box.LastChanged = now;
        await db.SaveChangesAsync(cancellationToken);

        return ToCredentialDto(credential, null);
    }

    public async Task<BoxCredentialDto?> UpdateCredentialAsync(
        Guid boxId, Guid credentialId, UpsertBoxCredentialRequest request, CancellationToken cancellationToken)
    {
        var kind = RequireCredentialKind(request.Kind);
        var label = Blank(request.Label) ?? throw new ArgumentException("Label must not be empty.");

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var credential = await db.BoxCredentials
            .FirstOrDefaultAsync(c => c.CredentialId == credentialId && c.BoxId == boxId, cancellationToken);
        if (credential is null) return null;

        if (!string.Equals(credential.Label, label, StringComparison.Ordinal) &&
            await db.BoxCredentials.AnyAsync(
                c => c.BoxId == boxId && c.Label == label && c.CredentialId != credentialId, cancellationToken))
        {
            throw new ArgumentException($"A credential labeled '{label}' already exists on this box.");
        }

        credential.Kind = kind;
        credential.Label = label;
        credential.Username = Blank(request.Username);
        credential.Value = Blank(request.Value);
        credential.KeyPath = Blank(request.KeyPath);
        credential.Fingerprint = Blank(request.Fingerprint);
        credential.Comment = Blank(request.Comment);
        credential.Ordinal = request.Ordinal ?? credential.Ordinal;
        credential.LastChanged = DateTime.UtcNow;

        await db.SaveChangesAsync(cancellationToken);

        var file = await db.BoxCredentialFiles
            .AsNoTracking()
            .Where(f => f.CredentialId == credentialId)
            .Select(f => new BoxCredentialFileDto(f.FileName, f.ContentType, f.ByteSize, f.UploadedAt))
            .FirstOrDefaultAsync(cancellationToken);

        return ToCredentialDto(credential, file);
    }

    public async Task<bool> DeleteCredentialAsync(Guid boxId, Guid credentialId, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var credential = await db.BoxCredentials
            .FirstOrDefaultAsync(c => c.CredentialId == credentialId && c.BoxId == boxId, cancellationToken);
        if (credential is null) return false;

        db.BoxCredentials.Remove(credential);
        await db.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<BoxCredentialDto?> SaveCredentialFileAsync(
        Guid boxId, Guid credentialId, string fileName, string contentType, byte[] content, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var credential = await db.BoxCredentials
            .FirstOrDefaultAsync(c => c.CredentialId == credentialId && c.BoxId == boxId, cancellationToken);
        if (credential is null) return null;

        var file = await db.BoxCredentialFiles.FirstOrDefaultAsync(f => f.CredentialId == credentialId, cancellationToken);
        var now = DateTime.UtcNow;

        if (file is null)
        {
            file = new BoxCredentialFile { CredentialId = credentialId };
            db.BoxCredentialFiles.Add(file);
        }

        file.FileName = fileName;
        file.ContentType = string.IsNullOrWhiteSpace(contentType) ? "application/octet-stream" : contentType;
        file.ByteSize = content.LongLength;
        file.Content = content;
        file.UploadedAt = now;

        credential.LastChanged = now;

        await db.SaveChangesAsync(cancellationToken);

        return ToCredentialDto(credential, new BoxCredentialFileDto(file.FileName, file.ContentType, file.ByteSize, file.UploadedAt));
    }

    public async Task<BoxCredentialFileContent?> GetCredentialFileAsync(
        Guid boxId, Guid credentialId, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        return await db.BoxCredentials
            .Where(c => c.CredentialId == credentialId && c.BoxId == boxId)
            .Join(
                db.BoxCredentialFiles.AsNoTracking(),
                c => c.CredentialId,
                f => f.CredentialId,
                (c, f) => new BoxCredentialFileContent(f.Content, f.ContentType, f.FileName))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<bool> DeleteCredentialFileAsync(Guid boxId, Guid credentialId, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var file = await db.BoxCredentialFiles
            .Join(
                db.BoxCredentials.Where(c => c.BoxId == boxId),
                f => f.CredentialId,
                c => c.CredentialId,
                (f, _) => f)
            .FirstOrDefaultAsync(f => f.CredentialId == credentialId, cancellationToken);
        if (file is null) return false;

        db.BoxCredentialFiles.Remove(file);
        await db.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<BoxAppDto> CreateBoxAppAsync(
        Guid boxId, UpsertBoxAppRequest request, CancellationToken cancellationToken)
    {
        var name = Blank(request.Name) ?? throw new ArgumentException("Name must not be empty.");
        var slot = RequireSlot(request.Slot);

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var box = await RequireBoxAsync(db, boxId, cancellationToken);

        if (await db.BoxApps.AnyAsync(a => a.BoxId == box.BoxId && a.Name == name, cancellationToken))
        {
            throw new ArgumentException($"'{box.Name}' already holds an app named '{name}'.");
        }

        var next = await db.BoxApps
            .Where(a => a.BoxId == box.BoxId)
            .Select(a => (int?)a.Ordinal)
            .MaxAsync(cancellationToken) ?? 0;

        var app = new BoxApp
        {
            BoxAppId = Guid.CreateVersion7(),
            BoxId = box.BoxId,
            Name = name,
            Container = Blank(request.Container),
            Image = Blank(request.Image),
            Slot = slot,
            Hostnames = Blank(request.Hostnames),
            PublishedPort = request.PublishedPort,
            EnvFile = Blank(request.EnvFile),
            Ordinal = request.Ordinal ?? next + 1
        };

        db.BoxApps.Add(app);
        box.LastChanged = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);

        return ToBoxAppDto(app);
    }

    public async Task<BoxAppDto?> UpdateBoxAppAsync(
        Guid boxId, Guid boxAppId, UpsertBoxAppRequest request, CancellationToken cancellationToken)
    {
        var name = Blank(request.Name) ?? throw new ArgumentException("Name must not be empty.");
        var slot = RequireSlot(request.Slot);

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var app = await db.BoxApps
            .FirstOrDefaultAsync(a => a.BoxAppId == boxAppId && a.BoxId == boxId, cancellationToken);
        if (app is null) return null;

        if (!string.Equals(app.Name, name, StringComparison.Ordinal) &&
            await db.BoxApps.AnyAsync(
                a => a.BoxId == boxId && a.Name == name && a.BoxAppId != boxAppId, cancellationToken))
        {
            throw new ArgumentException($"An app named '{name}' already exists on this box.");
        }

        app.Name = name;
        app.Container = Blank(request.Container);
        app.Image = Blank(request.Image);
        app.Slot = slot;
        app.Hostnames = Blank(request.Hostnames);
        app.PublishedPort = request.PublishedPort;
        app.EnvFile = Blank(request.EnvFile);
        app.Ordinal = request.Ordinal ?? app.Ordinal;

        var box = await RequireBoxAsync(db, boxId, cancellationToken);
        box.LastChanged = DateTime.UtcNow;

        await db.SaveChangesAsync(cancellationToken);

        return ToBoxAppDto(app);
    }

    public async Task<bool> DeleteBoxAppAsync(Guid boxId, Guid boxAppId, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var app = await db.BoxApps
            .FirstOrDefaultAsync(a => a.BoxAppId == boxAppId && a.BoxId == boxId, cancellationToken);
        if (app is null) return false;

        db.BoxApps.Remove(app);
        await db.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static async Task<BoxDetailDto?> LoadDetailAsync(
        SecretsDbContext db, Guid boxId, CancellationToken cancellationToken)
    {
        var box = await db.Boxes
            .AsNoTracking()
            .Where(b => b.BoxId == boxId)
            .Select(b => new
            {
                b.BoxId,
                b.Name,
                b.Provider,
                b.ServerId,
                b.Ipv4,
                b.Ipv6,
                b.ServerType,
                b.Location,
                b.Hostname,
                b.Role,
                b.SshUser,
                b.SshKeyPath,
                b.SshKeyName,
                b.StackDir,
                b.EdgeDir,
                b.EdgeContainer,
                b.DockerNetwork,
                b.PortBand,
                b.ComposePath,
                b.EnvDir,
                b.Notes,
                b.Ordinal,
                b.LastChanged,
                Credentials = b.Credentials
                    .OrderBy(c => c.Ordinal).ThenBy(c => c.Label)
                    .Select(c => new BoxCredentialDto(
                        c.CredentialId,
                        c.Kind,
                        c.Label,
                        c.Username,
                        c.Value,
                        c.KeyPath,
                        c.Fingerprint,
                        c.Comment,
                        c.Ordinal,
                        c.LastChanged,
                        db.BoxCredentialFiles
                            .Where(f => f.CredentialId == c.CredentialId)
                            .Select(f => new BoxCredentialFileDto(f.FileName, f.ContentType, f.ByteSize, f.UploadedAt))
                            .FirstOrDefault()))
                    .ToList(),
                Apps = b.Apps
                    .OrderBy(a => a.Ordinal).ThenBy(a => a.Name)
                    .Select(a => new BoxAppDto(
                        a.BoxAppId,
                        a.Name,
                        a.Container,
                        a.Image,
                        a.Slot,
                        a.Hostnames,
                        a.PublishedPort,
                        a.EnvFile,
                        a.Ordinal))
                    .ToList()
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (box is null) return null;

        return new BoxDetailDto(
            box.BoxId,
            box.Name,
            box.Provider,
            box.ServerId,
            box.Ipv4,
            box.Ipv6,
            box.ServerType,
            box.Location,
            box.Hostname,
            box.Role,
            box.SshUser,
            box.SshKeyPath,
            box.SshKeyName,
            SshCommand(box.SshKeyPath, box.SshUser, box.Ipv4),
            box.StackDir,
            box.EdgeDir,
            box.EdgeContainer,
            box.DockerNetwork,
            box.PortBand,
            box.ComposePath,
            box.EnvDir,
            box.Notes,
            box.Ordinal,
            box.LastChanged,
            box.Credentials,
            box.Apps);
    }

    private static BoxDetailDto ToDetailDto(Box box, IReadOnlyList<BoxCredentialDto> credentials, IReadOnlyList<BoxAppDto> apps) =>
        new(
            box.BoxId,
            box.Name,
            box.Provider,
            box.ServerId,
            box.Ipv4,
            box.Ipv6,
            box.ServerType,
            box.Location,
            box.Hostname,
            box.Role,
            box.SshUser,
            box.SshKeyPath,
            box.SshKeyName,
            SshCommand(box.SshKeyPath, box.SshUser, box.Ipv4),
            box.StackDir,
            box.EdgeDir,
            box.EdgeContainer,
            box.DockerNetwork,
            box.PortBand,
            box.ComposePath,
            box.EnvDir,
            box.Notes,
            box.Ordinal,
            box.LastChanged,
            credentials,
            apps);

    private static BoxCredentialDto ToCredentialDto(BoxCredential c, BoxCredentialFileDto? file) =>
        new(c.CredentialId, c.Kind, c.Label, c.Username, c.Value, c.KeyPath, c.Fingerprint, c.Comment, c.Ordinal, c.LastChanged, file);

    private static BoxAppDto ToBoxAppDto(BoxApp a) =>
        new(a.BoxAppId, a.Name, a.Container, a.Image, a.Slot, a.Hostnames, a.PublishedPort, a.EnvFile, a.Ordinal);

    private static async Task<Box> RequireBoxAsync(SecretsDbContext db, Guid boxId, CancellationToken cancellationToken)
    {
        return await db.Boxes.FirstOrDefaultAsync(b => b.BoxId == boxId, cancellationToken)
            ?? throw new ArgumentException($"Unknown box '{boxId}'.");
    }

    private static string RequireCredentialKind(string? kind)
    {
        var value = Blank(kind)?.ToLowerInvariant() ?? throw new ArgumentException("Kind must not be empty.");

        if (!BoxCredentialKind.IsKnown(value))
        {
            throw new ArgumentException($"Unknown credential kind '{kind}'. Known kinds: {string.Join(", ", BoxCredentialKind.All)}.");
        }

        return value;
    }

    private static string? RequireSlot(string? slot)
    {
        var value = Blank(slot)?.ToLowerInvariant();

        if (value is not (null or "blue" or "green"))
        {
            throw new ArgumentException($"Unknown slot '{slot}'. Expected 'blue' or 'green'.");
        }

        return value;
    }

    private static string? Blank(string? value)
    {
        var trimmed = (value ?? "").Trim();
        return trimmed.Length == 0 ? null : trimmed;
    }

    private static string? SshCommand(string? sshKeyPath, string? sshUser, string? ipv4)
    {
        if (string.IsNullOrWhiteSpace(sshKeyPath) || string.IsNullOrWhiteSpace(sshUser) || string.IsNullOrWhiteSpace(ipv4))
        {
            return null;
        }

        return $"ssh -i {sshKeyPath} -o IdentitiesOnly=yes {sshUser}@{ipv4}";
    }
}
