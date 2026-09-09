using Microsoft.EntityFrameworkCore;
using SecretsMcp.Contracts;
using SecretsMcp.Data;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Repositories;

public sealed class SecretListRepository(IDbContextFactory<SecretsDbContext> contextFactory) : ISecretListRepository
{
    public async Task<IReadOnlyList<SecretListDto>> ListAsync(CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        return await db.SecretLists
            .AsNoTracking()
            .OrderBy(l => l.ListId)
            .Select(l => new SecretListDto(
                l.ListId,
                l.Name,
                l.Description,
                l.Type,
                db.Secrets
                    .Where(s => s.ListId == l.ListId)
                    .Select(s => s.Name)
                    .Distinct()
                    .Count()))
            .ToListAsync(cancellationToken);
    }

    public async Task<SecretListDto> CreateAsync(CreateSecretListRequest request, CancellationToken cancellationToken)
    {
        var name = (request.Name ?? "").Trim();
        var description = (request.Description ?? "").Trim();

        if (name.Length == 0)
        {
            throw new ArgumentException("Name must not be empty.");
        }

        if (!Enum.IsDefined(request.Type))
        {
            throw new ArgumentException($"Unknown list type: {(int)request.Type}.");
        }

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        if (await db.SecretLists.AnyAsync(l => l.Name == name, cancellationToken))
        {
            throw new InvalidOperationException($"A list named '{name}' already exists.");
        }

        var list = new SecretList
        {
            ListId = Guid.CreateVersion7(),
            Name = name,
            Description = description.Length == 0 ? null : description,
            Type = request.Type
        };

        db.SecretLists.Add(list);
        await db.SaveChangesAsync(cancellationToken);

        return new SecretListDto(list.ListId, list.Name, list.Description, list.Type, 0);
    }

    public async Task<SecretListDto?> UpdateAsync(
        Guid listId,
        UpdateSecretListRequest request,
        CancellationToken cancellationToken)
    {
        var name = (request.Name ?? "").Trim();
        var description = (request.Description ?? "").Trim();

        if (name.Length == 0)
        {
            throw new ArgumentException("Name must not be empty.");
        }

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var list = await db.SecretLists.FirstOrDefaultAsync(l => l.ListId == listId, cancellationToken);
        if (list is null)
        {
            return null;
        }

        if (await db.SecretLists.AnyAsync(l => l.Name == name && l.ListId != listId, cancellationToken))
        {
            throw new InvalidOperationException($"A list named '{name}' already exists.");
        }

        list.Name = name;
        list.Description = description.Length == 0 ? null : description;

        await db.SaveChangesAsync(cancellationToken);

        var secretCount = await db.Secrets
            .Where(s => s.ListId == listId)
            .Select(s => s.Name)
            .Distinct()
            .CountAsync(cancellationToken);

        return new SecretListDto(list.ListId, list.Name, list.Description, list.Type, secretCount);
    }

    public async Task<int?> DeleteAsync(Guid listId, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        await using var tx = await db.Database.BeginTransactionAsync(cancellationToken);

        var deletedSecrets = await db.Secrets
            .Where(s => s.ListId == listId)
            .ExecuteDeleteAsync(cancellationToken);

        var deletedLists = await db.SecretLists
            .Where(l => l.ListId == listId)
            .ExecuteDeleteAsync(cancellationToken);

        if (deletedLists == 0)
        {
            await tx.RollbackAsync(cancellationToken);
            return null;
        }

        await tx.CommitAsync(cancellationToken);

        return deletedSecrets;
    }

    public async Task<Guid> RequireIdAsync(string name, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var target = (name ?? "").Trim();

        var listId = await db.SecretLists
            .AsNoTracking()
            .Where(l => l.Name == target)
            .Select(l => (Guid?)l.ListId)
            .FirstOrDefaultAsync(cancellationToken);

        if (listId is null)
        {
            var known = await db.SecretLists
                .AsNoTracking()
                .OrderBy(l => l.ListId)
                .Select(l => l.Name)
                .ToListAsync(cancellationToken);

            throw new ArgumentException($"Unknown list '{name}'. The store holds: {string.Join(", ", known)}.");
        }

        return listId.Value;
    }
}
