using SecretsMcp.Contracts;

namespace SecretsMcp.Repositories;

public interface ISecretListRepository
{
    Task<IReadOnlyList<SecretListDto>> ListAsync(CancellationToken cancellationToken);

    Task<SecretListDto> CreateAsync(CreateSecretListRequest request, CancellationToken cancellationToken);

    Task<SecretListDto?> UpdateAsync(Guid listId, UpdateSecretListRequest request, CancellationToken cancellationToken);

    Task<int?> DeleteAsync(Guid listId, CancellationToken cancellationToken);

    Task<Guid> RequireIdAsync(string name, CancellationToken cancellationToken);
}
