using Microsoft.EntityFrameworkCore;
using SecretsMcp.Data;

namespace SecretsMcp.Services;

public sealed class AccessLogRetentionService(
    IServiceScopeFactory scopeFactory,
    ILogger<AccessLogRetentionService> logger) : BackgroundService
{
    private static readonly TimeSpan RetentionPeriod = TimeSpan.FromDays(14);
    private static readonly TimeSpan Interval = TimeSpan.FromHours(24);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(Interval);

        do
        {
            await PurgeExpiredEntriesAsync(stoppingToken);
        }
        while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken));
    }

    private async Task PurgeExpiredEntriesAsync(CancellationToken cancellationToken)
    {
        try
        {
            await using var scope = scopeFactory.CreateAsyncScope();
            var contextFactory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<SecretsDbContext>>();
            await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

            var cutoff = DateTime.UtcNow - RetentionPeriod;
            var deleted = await db.AccessLog.Where(e => e.OccurredAt < cutoff).ExecuteDeleteAsync(cancellationToken);

            if (deleted > 0)
            {
                logger.LogInformation("Purged {Count} access-log entries older than {Cutoff}.", deleted, cutoff);
            }
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.LogWarning(ex, "Access-log retention purge failed.");
        }
    }
}
