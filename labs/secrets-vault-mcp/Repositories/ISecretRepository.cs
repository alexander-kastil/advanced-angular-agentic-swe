using SecretsMcp.Contracts;

namespace SecretsMcp.Repositories;

public interface ISecretRepository
{
    Task<IReadOnlyList<SecretDto>> ListAsync(Guid? listId, string? search, int limit, CancellationToken cancellationToken);

    Task<IReadOnlyList<SecretDto>> ListAllAsync(CancellationToken cancellationToken);

    Task<SecretDto?> GetAsync(Guid listId, string name, int? version, CancellationToken cancellationToken);

    Task<VaultFileContent?> GetFileAsync(Guid listId, string name, CancellationToken cancellationToken);

    Task<IReadOnlyList<SecretDto>> ListVersionsAsync(Guid listId, string name, CancellationToken cancellationToken);

    Task<SecretDto> CreateAsync(CreateSecretRequest request, CancellationToken cancellationToken);

    Task<SecretDto> UploadAsync(
        Guid listId,
        string? name,
        string? comment,
        IReadOnlyList<Guid>? categoryIds,
        string fileName,
        string contentType,
        byte[] content,
        CancellationToken cancellationToken);

    Task<SecretDto> UpdateAsync(Guid listId, string name, UpdateSecretRequest request, CancellationToken cancellationToken);

    Task<SecretDto> RenameAsync(Guid listId, string name, string newName, CancellationToken cancellationToken);

    Task<int> DeleteAsync(Guid listId, string name, CancellationToken cancellationToken);
}
