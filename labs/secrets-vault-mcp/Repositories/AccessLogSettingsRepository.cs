using Microsoft.EntityFrameworkCore;
using SecretsMcp.Data;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Repositories;

public sealed class AccessLogSettingsRepository(IDbContextFactory<SecretsDbContext> contextFactory) : IAccessLogSettingsRepository
{
    public async Task<bool> GetRecordCodingAgentOnlyAsync(CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var row = await db.AccessLogSettings
            .AsNoTracking()
            .Where(s => s.Id == AccessLogSettings.SingletonId)
            .Select(s => (bool?)s.RecordCodingAgentOnly)
            .FirstOrDefaultAsync(cancellationToken);

        return row ?? true;
    }

    public async Task SetRecordCodingAgentOnlyAsync(bool recordCodingAgentOnly, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var row = await db.AccessLogSettings.FirstOrDefaultAsync(s => s.Id == AccessLogSettings.SingletonId, cancellationToken);

        if (row is null)
        {
            row = new AccessLogSettings { Id = AccessLogSettings.SingletonId };
            db.AccessLogSettings.Add(row);
        }

        row.RecordCodingAgentOnly = recordCodingAgentOnly;
        row.LastChanged = DateTime.UtcNow;

        await db.SaveChangesAsync(cancellationToken);
    }
}
