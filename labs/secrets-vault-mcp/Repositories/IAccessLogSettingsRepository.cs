namespace SecretsMcp.Repositories;

public interface IAccessLogSettingsRepository
{
    Task<bool> GetRecordCodingAgentOnlyAsync(CancellationToken cancellationToken);

    Task SetRecordCodingAgentOnlyAsync(bool recordCodingAgentOnly, CancellationToken cancellationToken);
}
