using SecretsMcp.Repositories;

namespace SecretsMcp.Services;

public sealed class AccessLogSettingsCache(IServiceScopeFactory scopeFactory) : IAccessLogSettingsCache
{
    private readonly SemaphoreSlim gate = new(1, 1);
    private bool? cached;

    public async Task<bool> GetRecordCodingAgentOnlyAsync(CancellationToken cancellationToken)
    {
        if (cached is { } value)
        {
            return value;
        }

        await gate.WaitAsync(cancellationToken);
        try
        {
            if (cached is { } cachedValue)
            {
                return cachedValue;
            }

            await using var scope = scopeFactory.CreateAsyncScope();
            var repository = scope.ServiceProvider.GetRequiredService<IAccessLogSettingsRepository>();
            cached = await repository.GetRecordCodingAgentOnlyAsync(cancellationToken);

            return cached.Value;
        }
        catch
        {
            return false;
        }
        finally
        {
            gate.Release();
        }
    }

    public void Invalidate() => cached = null;
}
