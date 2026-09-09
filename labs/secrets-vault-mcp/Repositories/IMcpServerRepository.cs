using SecretsMcp.Contracts;

namespace SecretsMcp.Repositories;

public interface IMcpServerRepository
{
    Task<IReadOnlyList<McpServerDto>> ListAsync(CancellationToken cancellationToken);

    Task<McpServerDto> CreateAsync(CreateMcpServerRequest request, CancellationToken cancellationToken);

    Task<McpServerDto?> UpdateAsync(
        Guid mcpServerId,
        UpdateMcpServerRequest request,
        CancellationToken cancellationToken);

    Task<bool> DeleteAsync(Guid mcpServerId, CancellationToken cancellationToken);
}
