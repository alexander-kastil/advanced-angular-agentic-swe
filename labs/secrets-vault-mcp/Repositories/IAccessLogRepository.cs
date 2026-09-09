using SecretsMcp.Contracts;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Repositories;

public interface IAccessLogRepository
{
    Task RecordAsync(AccessLogEntry entry, CancellationToken cancellationToken);

    Task<AccessLogPageDto> ListAsync(
        int skip,
        int take,
        string? action,
        string? entityType,
        string? userName,
        CancellationToken cancellationToken);
}
