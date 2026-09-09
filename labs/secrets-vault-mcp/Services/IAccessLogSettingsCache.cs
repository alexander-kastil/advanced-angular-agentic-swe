namespace SecretsMcp.Services;

public interface IAccessLogSettingsCache
{
    Task<bool> GetRecordCodingAgentOnlyAsync(CancellationToken cancellationToken);

    void Invalidate();
}
