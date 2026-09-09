using SecretsMcp.Contracts;

namespace SecretsMcp.Repositories;

public interface IProviderKeyRepository
{
    Task<IReadOnlyList<ProviderKeyDto>> ListAsync(CancellationToken cancellationToken);

    Task<ProviderKeyDto> SetAsync(
        string provider,
        string serviceKey,
        SetProviderKeyRequest request,
        CancellationToken cancellationToken);

    Task<string?> ResolveDecryptedAsync(string provider, string serviceKey, CancellationToken cancellationToken);

    Task<string?> ResolveBaseUrlAsync(string provider, string serviceKey, CancellationToken cancellationToken);
}
