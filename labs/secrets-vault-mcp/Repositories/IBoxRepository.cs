using SecretsMcp.Contracts;

namespace SecretsMcp.Repositories;

public interface IBoxRepository
{
    Task<IReadOnlyList<BoxDto>> ListAsync(CancellationToken cancellationToken);

    Task<BoxDetailDto?> GetByIdAsync(Guid boxId, CancellationToken cancellationToken);

    Task<BoxDetailDto> CreateAsync(UpsertBoxRequest request, CancellationToken cancellationToken);

    Task<BoxDetailDto?> UpdateAsync(Guid boxId, UpsertBoxRequest request, CancellationToken cancellationToken);

    Task<bool> DeleteAsync(Guid boxId, CancellationToken cancellationToken);

    Task<BoxCredentialDto> CreateCredentialAsync(
        Guid boxId, UpsertBoxCredentialRequest request, CancellationToken cancellationToken);

    Task<BoxCredentialDto?> UpdateCredentialAsync(
        Guid boxId, Guid credentialId, UpsertBoxCredentialRequest request, CancellationToken cancellationToken);

    Task<bool> DeleteCredentialAsync(Guid boxId, Guid credentialId, CancellationToken cancellationToken);

    Task<BoxCredentialDto?> SaveCredentialFileAsync(
        Guid boxId, Guid credentialId, string fileName, string contentType, byte[] content, CancellationToken cancellationToken);

    Task<BoxCredentialFileContent?> GetCredentialFileAsync(Guid boxId, Guid credentialId, CancellationToken cancellationToken);

    Task<bool> DeleteCredentialFileAsync(Guid boxId, Guid credentialId, CancellationToken cancellationToken);

    Task<BoxAppDto> CreateBoxAppAsync(Guid boxId, UpsertBoxAppRequest request, CancellationToken cancellationToken);

    Task<BoxAppDto?> UpdateBoxAppAsync(
        Guid boxId, Guid boxAppId, UpsertBoxAppRequest request, CancellationToken cancellationToken);

    Task<bool> DeleteBoxAppAsync(Guid boxId, Guid boxAppId, CancellationToken cancellationToken);
}
