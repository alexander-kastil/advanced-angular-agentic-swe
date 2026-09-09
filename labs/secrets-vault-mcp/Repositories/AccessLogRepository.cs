using Microsoft.EntityFrameworkCore;
using SecretsMcp.Contracts;
using SecretsMcp.Data;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Repositories;

public sealed class AccessLogRepository(IDbContextFactory<SecretsDbContext> contextFactory) : IAccessLogRepository
{
    public async Task RecordAsync(AccessLogEntry entry, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        db.AccessLog.Add(entry);
        await db.SaveChangesAsync(cancellationToken);
    }

    public async Task<AccessLogPageDto> ListAsync(
        int skip,
        int take,
        string? action,
        string? entityType,
        string? userName,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var query = db.AccessLog.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(action))
        {
            query = query.Where(e => e.Action == action);
        }

        if (!string.IsNullOrWhiteSpace(entityType))
        {
            query = query.Where(e => e.EntityType == entityType);
        }

        if (!string.IsNullOrWhiteSpace(userName))
        {
            query = query.Where(e => e.UserName == userName);
        }

        var total = await query.CountAsync(cancellationToken);

        var entries = await query
            .OrderByDescending(e => e.OccurredAt)
            .Skip(Math.Max(skip, 0))
            .Take(take)
            .Select(e => new AccessLogEntryDto(
                e.AccessLogId, e.OccurredAt, e.Action, e.EntityType, e.EntityName, e.EntityId, e.UserName, e.IpAddress, e.Details))
            .ToListAsync(cancellationToken);

        return new AccessLogPageDto(total, entries);
    }
}
