using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SecretsMcp.Config;
using SecretsMcp.Contracts;
using SecretsMcp.Data;
using SecretsMcp.Data.Encryption;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Repositories;

public sealed class SecretRepository(
    IDbContextFactory<SecretsDbContext> contextFactory,
    IDbValueCipher cipher,
    AppConfig config) : ISecretRepository
{
    public async Task<IReadOnlyList<SecretDto>> ListAsync(
        Guid? listId,
        string? search,
        int limit,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var query = LatestVersions(db);

        if (listId is not null)
        {
            query = query.Where(s => s.ListId == listId);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var pattern = $"%{search.Trim()}%";
            query = query.Where(s =>
                EF.Functions.Like(s.Name, pattern)
                || (s.Url != null && EF.Functions.Like(s.Url, pattern))
                || (s.User != null && EF.Functions.Like(s.User, pattern))
                || (s.Comment != null && EF.Functions.Like(s.Comment, pattern)));
        }

        var rows = await query
            .OrderBy(s => s.ListId).ThenBy(s => s.Name)
            .Take(Math.Clamp(limit, 1, 1000))
            .Select(Projection(db, cipher.Passphrase))
            .ToListAsync(cancellationToken);

        return rows.Select(ToDto).ToList();
    }

    public async Task<IReadOnlyList<SecretDto>> ListAllAsync(CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var rows = await LatestVersions(db)
            .OrderBy(s => s.ListId).ThenBy(s => s.Name)
            .Select(Projection(db, cipher.Passphrase))
            .ToListAsync(cancellationToken);

        var distinctNames = await db.Secrets
            .Select(s => new { s.ListId, s.Name })
            .Distinct()
            .CountAsync(cancellationToken);

        if (rows.Count != distinctNames)
        {
            throw new InvalidOperationException(
                $"Exported {rows.Count} secret(s) but the store holds {distinctNames} distinct name(s).");
        }

        return rows.Select(ToDto).ToList();
    }

    public async Task<SecretDto?> GetAsync(
        Guid listId,
        string name,
        int? version,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var query = version is null
            ? LatestVersions(db).Where(s => s.ListId == listId && s.Name == name)
            : db.Secrets.AsNoTracking().Where(s => s.ListId == listId && s.Name == name && s.Version == version);

        var row = await query.Select(Projection(db, cipher.Passphrase)).FirstOrDefaultAsync(cancellationToken);

        return row is null ? null : ToDto(row);
    }

    public async Task<VaultFileContent?> GetFileAsync(
        Guid listId,
        string name,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        return await LatestVersions(db)
            .Where(s => s.ListId == listId && s.Name == name)
            .Join(
                db.VaultFiles.AsNoTracking(),
                s => s.SecretId,
                f => f.SecretId,
                (s, f) => new VaultFileContent(f.Content, f.ContentType, f.FileName))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<SecretDto>> ListVersionsAsync(
        Guid listId,
        string name,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var rows = await db.Secrets
            .AsNoTracking()
            .Where(s => s.ListId == listId && s.Name == name)
            .OrderByDescending(s => s.Version)
            .Select(Projection(db, cipher.Passphrase))
            .ToListAsync(cancellationToken);

        return rows.Select(ToDto).ToList();
    }

    public async Task<SecretDto> CreateAsync(
        CreateSecretRequest request,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        await RequireList(db, request.ListId, cancellationToken);

        if (await db.Secrets.AnyAsync(s => s.ListId == request.ListId && s.Name == request.Name, cancellationToken))
        {
            throw new InvalidOperationException($"A secret named '{request.Name}' already exists in this list.");
        }

        var categoryIds = await ResolveCategoryIds(db, request.ListId, request.CategoryIds, cancellationToken);

        var secret = new Secret
        {
            SecretId = Guid.CreateVersion7(),
            ListId = request.ListId,
            Name = request.Name,
            Url = request.Url,
            User = request.User,
            Password = string.IsNullOrWhiteSpace(request.Password) ? null : request.Password,
            Comment = request.Comment,
            Mfa = request.Mfa,
            Version = 1,
            LastChanged = DateTime.UtcNow
        };

        cipher.Validate(secret);

        await using var tx = await db.Database.BeginTransactionAsync(cancellationToken);
        db.Secrets.Add(secret);
        AddSecretCategories(db, secret.SecretId, categoryIds);
        await db.SaveChangesAsync(cancellationToken);
        await cipher.WriteAsync(db, secret, cancellationToken);
        await tx.CommitAsync(cancellationToken);

        return Project(secret, categoryIds, null);
    }

    public async Task<SecretDto> UploadAsync(
        Guid listId,
        string? name,
        string? comment,
        IReadOnlyList<Guid>? categoryIds,
        string fileName,
        string contentType,
        byte[] content,
        CancellationToken cancellationToken)
    {
        var converted = (Content: content, ContentType: contentType, FileName: fileName);

        var targetName = string.IsNullOrWhiteSpace(name)
            ? Path.GetFileNameWithoutExtension(converted.FileName)
            : name.Trim();

        if (targetName.Length == 0)
        {
            throw new ArgumentException("The name must not be empty.", nameof(name));
        }

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var listType = await RequireListType(db, listId, cancellationToken);

        var current = await db.Secrets
            .AsNoTracking()
            .Where(s => s.ListId == listId && s.Name == targetName)
            .OrderByDescending(s => s.Version)
            .Select(Projection(db, cipher.Passphrase))
            .FirstOrDefaultAsync(cancellationToken);

        if (current is not null)
        {
            if (listType != SecretListType.Vault)
            {
                throw new InvalidOperationException($"A secret named '{targetName}' already exists in this list.");
            }

            return await UploadNextVersionAsync(db, listId, targetName, current, comment, categoryIds, converted, cancellationToken);
        }

        var resolved = await ResolveCategoryIds(db, listId, categoryIds, cancellationToken);

        var secret = new Secret
        {
            SecretId = Guid.CreateVersion7(),
            ListId = listId,
            Name = targetName,
            Comment = comment,
            Mfa = false,
            Version = 1,
            LastChanged = DateTime.UtcNow
        };

        var file = new VaultFile
        {
            SecretId = secret.SecretId,
            FileName = converted.FileName,
            ContentType = converted.ContentType,
            ByteSize = converted.Content.LongLength,
            Content = converted.Content,
            UploadedAt = DateTime.UtcNow
        };

        await using var tx = await db.Database.BeginTransactionAsync(cancellationToken);
        db.Secrets.Add(secret);
        db.VaultFiles.Add(file);
        AddSecretCategories(db, secret.SecretId, resolved);
        await db.SaveChangesAsync(cancellationToken);
        await tx.CommitAsync(cancellationToken);

        return Project(secret, resolved, new VaultFileRow(file.FileName, file.ContentType, file.ByteSize));
    }

    private async Task<SecretDto> UploadNextVersionAsync(
        SecretsDbContext db,
        Guid listId,
        string targetName,
        SecretRow current,
        string? comment,
        IReadOnlyList<Guid>? categoryIds,
        (byte[] Content, string ContentType, string FileName) converted,
        CancellationToken cancellationToken)
    {
        var resolvedCategories = categoryIds is null
            ? current.CategoryIds
            : await ResolveCategoryIds(db, listId, categoryIds, cancellationToken);

        var next = new Secret
        {
            SecretId = Guid.CreateVersion7(),
            ListId = listId,
            Name = targetName,
            Url = current.Url,
            User = current.User,
            Password = DecryptedValue.Require(current.Password, current.HasCipher, current.Name),
            Comment = Merge(comment, current.Comment),
            Mfa = current.Mfa,
            Version = current.Version + 1,
            LastChanged = DateTime.UtcNow
        };

        cipher.Validate(next);

        await using var tx = await db.Database.BeginTransactionAsync(cancellationToken);

        db.Secrets.Add(next);
        AddSecretCategories(db, next.SecretId, resolvedCategories);

        var file = new VaultFile
        {
            SecretId = next.SecretId,
            FileName = converted.FileName,
            ContentType = converted.ContentType,
            ByteSize = converted.Content.LongLength,
            Content = converted.Content,
            UploadedAt = DateTime.UtcNow
        };
        db.VaultFiles.Add(file);

        await db.SaveChangesAsync(cancellationToken);
        await cipher.WriteAsync(db, next, cancellationToken);
        await PruneOldVersionsAsync(db, listId, targetName, cancellationToken);
        await tx.CommitAsync(cancellationToken);

        return Project(next, resolvedCategories, new VaultFileRow(file.FileName, file.ContentType, file.ByteSize));
    }

    public async Task<SecretDto> UpdateAsync(
        Guid listId,
        string name,
        UpdateSecretRequest request,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var current = await db.Secrets
            .AsNoTracking()
            .Where(s => s.ListId == listId && s.Name == name)
            .OrderByDescending(s => s.Version)
            .Select(Projection(db, cipher.Passphrase))
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new InvalidOperationException($"No secret named '{name}' in this list.");

        var targetName = current.Name;
        if (request.Name is not null)
        {
            targetName = request.Name.Trim();
            if (targetName.Length == 0)
            {
                throw new ArgumentException("The name must not be empty.", nameof(request));
            }

            if (targetName != current.Name
                && await db.Secrets.AnyAsync(s => s.ListId == listId && s.Name == targetName, cancellationToken))
            {
                throw new SecretNameConflictException($"A secret named '{targetName}' already exists in this list.");
            }
        }

        var categoryIds = request.CategoryIds is null
            ? await db.SecretCategories
                .AsNoTracking()
                .Where(sc => sc.SecretId == current.SecretId)
                .OrderBy(sc => sc.CategoryId)
                .Select(sc => sc.CategoryId)
                .ToListAsync(cancellationToken)
            : await ResolveCategoryIds(db, listId, request.CategoryIds, cancellationToken);

        var listType = await db.SecretLists
            .Where(l => l.ListId == listId)
            .Select(l => l.Type)
            .FirstAsync(cancellationToken);

        var next = new Secret
        {
            SecretId = Guid.CreateVersion7(),
            ListId = listId,
            Name = targetName,
            Url = Merge(request.Url, current.Url),
            User = Merge(request.User, current.User),
            Password = Merge(request.Password, DecryptedValue.Require(current.Password, current.HasCipher, current.Name)),
            Comment = Merge(request.Comment, current.Comment),
            Mfa = request.Mfa ?? current.Mfa,
            Version = current.Version + 1,
            LastChanged = DateTime.UtcNow
        };

        cipher.Validate(next);

        await using var tx = await db.Database.BeginTransactionAsync(cancellationToken);

        if (targetName != current.Name)
        {
            await db.Secrets
                .Where(s => s.ListId == listId && s.Name == current.Name)
                .ExecuteUpdateAsync(setters => setters.SetProperty(s => s.Name, targetName), cancellationToken);
        }

        db.Secrets.Add(next);
        AddSecretCategories(db, next.SecretId, categoryIds);

        VaultFileRow? fileRow = null;
        if (current.File is not null)
        {
            var previousFile = await db.VaultFiles
                .AsNoTracking()
                .FirstAsync(f => f.SecretId == current.SecretId, cancellationToken);

            db.VaultFiles.Add(new VaultFile
            {
                SecretId = next.SecretId,
                FileName = previousFile.FileName,
                ContentType = previousFile.ContentType,
                ByteSize = previousFile.ByteSize,
                Content = previousFile.Content,
                UploadedAt = previousFile.UploadedAt
            });
            fileRow = new VaultFileRow(previousFile.FileName, previousFile.ContentType, previousFile.ByteSize);
        }

        await db.SaveChangesAsync(cancellationToken);
        await cipher.WriteAsync(db, next, cancellationToken);

        if (listType == SecretListType.Vault)
        {
            await PruneOldVersionsAsync(db, listId, targetName, cancellationToken);
        }

        await tx.CommitAsync(cancellationToken);

        return Project(next, categoryIds, fileRow);
    }

    private async Task PruneOldVersionsAsync(
        SecretsDbContext db, Guid listId, string name, CancellationToken cancellationToken)
    {
        var idsToKeep = await db.Secrets
            .Where(s => s.ListId == listId && s.Name == name)
            .OrderByDescending(s => s.Version)
            .Take(Math.Max(1, config.Vault.MaxFileVersions))
            .Select(s => s.SecretId)
            .ToListAsync(cancellationToken);

        await db.Secrets
            .Where(s => s.ListId == listId && s.Name == name && !idsToKeep.Contains(s.SecretId))
            .ExecuteDeleteAsync(cancellationToken);
    }

    public async Task<SecretDto> RenameAsync(
        Guid listId,
        string name,
        string newName,
        CancellationToken cancellationToken)
    {
        var target = newName?.Trim();
        if (string.IsNullOrEmpty(target))
        {
            throw new ArgumentException("The new name must not be empty.", nameof(newName));
        }

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        if (!await db.Secrets.AnyAsync(s => s.ListId == listId && s.Name == name, cancellationToken))
        {
            throw new KeyNotFoundException($"No secret named '{name}' in this list.");
        }

        if (target != name && await db.Secrets.AnyAsync(s => s.ListId == listId && s.Name == target, cancellationToken))
        {
            throw new InvalidOperationException($"A secret named '{target}' already exists in this list.");
        }

        if (target != name)
        {
            await db.Secrets
                .Where(s => s.ListId == listId && s.Name == name)
                .ExecuteUpdateAsync(setters => setters.SetProperty(s => s.Name, target), cancellationToken);
        }

        var row = await LatestVersions(db)
            .Where(s => s.ListId == listId && s.Name == target)
            .Select(Projection(db, cipher.Passphrase))
            .FirstAsync(cancellationToken);

        return ToDto(row);
    }

    public async Task<int> DeleteAsync(Guid listId, string name, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        return await db.Secrets
            .Where(s => s.ListId == listId && s.Name == name)
            .ExecuteDeleteAsync(cancellationToken);
    }

    private sealed record VaultFileRow(string FileName, string ContentType, long ByteSize);

    private sealed record SecretRow(
        Guid SecretId, Guid ListId, string Name, string? Url, string? User,
        string? Password, bool HasCipher, string? Comment, bool Mfa,
        IReadOnlyList<Guid> CategoryIds, int Version, DateTime LastChanged,
        VaultFileRow? File);

    private static Expression<Func<Secret, SecretRow>> Projection(SecretsDbContext db, string passphrase) => s => new SecretRow(
        s.SecretId, s.ListId, s.Name, s.Url, s.User,
        SecretsDbContext.DecryptDbValue(s.PasswordCipher, passphrase),
        s.PasswordCipher != null,
        s.Comment, s.Mfa,
        s.SecretCategories.OrderBy(sc => sc.CategoryId).Select(sc => sc.CategoryId).ToList(),
        s.Version, s.LastChanged,
        db.VaultFiles
            .Where(f => f.SecretId == s.SecretId)
            .Select(f => new VaultFileRow(f.FileName, f.ContentType, f.ByteSize))
            .FirstOrDefault());

    private static SecretDto ToDto(SecretRow r) => new(
        r.SecretId, r.ListId, r.Name, r.Url, r.User,
        DecryptedValue.Require(r.Password, r.HasCipher, r.Name),
        r.Comment, r.Mfa, r.CategoryIds, r.Version, r.LastChanged,
        r.File?.FileName, r.File?.ContentType, r.File?.ByteSize);

    private static IQueryable<Secret> LatestVersions(SecretsDbContext db) =>
        db.Secrets
            .AsNoTracking()
            .Where(s => s.Version == db.Secrets
                .Where(v => v.ListId == s.ListId && v.Name == s.Name)
                .Max(v => v.Version));

    private static string? Merge(string? incoming, string? current) =>
        incoming is null ? current : incoming.Length == 0 ? null : incoming;

    private static async Task RequireList(SecretsDbContext db, Guid listId, CancellationToken cancellationToken)
    {
        if (!await db.SecretLists.AnyAsync(l => l.ListId == listId, cancellationToken))
        {
            throw new ArgumentException($"Unknown list id: {listId}.");
        }
    }

    private static async Task<SecretListType> RequireListType(SecretsDbContext db, Guid listId, CancellationToken cancellationToken)
    {
        var type = await db.SecretLists
            .Where(l => l.ListId == listId)
            .Select(l => (SecretListType?)l.Type)
            .FirstOrDefaultAsync(cancellationToken);

        return type ?? throw new ArgumentException($"Unknown list id: {listId}.");
    }

    private static async Task<IReadOnlyList<Guid>> ResolveCategoryIds(
        SecretsDbContext db,
        Guid listId,
        IReadOnlyList<Guid>? requested,
        CancellationToken cancellationToken)
    {
        if (requested is null || requested.Count == 0)
        {
            return [];
        }

        var distinct = requested.Distinct().ToList();

        if (distinct.Count > 3)
        {
            throw new ArgumentException("A secret may carry at most 3 categories.");
        }

        var validIds = await db.Categories
            .Where(c => c.ListId == listId && distinct.Contains(c.CategoryId))
            .Select(c => c.CategoryId)
            .ToListAsync(cancellationToken);

        var unknown = distinct.Except(validIds).ToList();
        if (unknown.Count > 0)
        {
            throw new ArgumentException($"Unknown category id(s) for this list: {string.Join(", ", unknown)}.");
        }

        return distinct.OrderBy(id => id).ToList();
    }

    private static void AddSecretCategories(SecretsDbContext db, Guid secretId, IReadOnlyList<Guid> categoryIds)
    {
        foreach (var categoryId in categoryIds)
        {
            db.SecretCategories.Add(new SecretCategory { SecretId = secretId, CategoryId = categoryId });
        }
    }

    private static SecretDto Project(Secret s, IReadOnlyList<Guid> categoryIds, VaultFileRow? file) =>
        new(s.SecretId, s.ListId, s.Name, s.Url, s.User, s.Password, s.Comment, s.Mfa, categoryIds, s.Version, s.LastChanged,
            file?.FileName, file?.ContentType, file?.ByteSize);
}
