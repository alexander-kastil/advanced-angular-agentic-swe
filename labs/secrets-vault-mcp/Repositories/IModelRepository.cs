using SecretsMcp.Contracts;

namespace SecretsMcp.Repositories;

public interface IModelRepository
{
    Task<IReadOnlyList<ModelDto>> ListAsync(string? provider, CancellationToken cancellationToken);

    Task<ModelDto> CreateAsync(CreateModelRequest request, CancellationToken cancellationToken);

    Task<ModelDto?> UpdateAsync(
        string provider,
        string modelName,
        UpdateModelRequest request,
        CancellationToken cancellationToken);

    Task<bool> DeleteAsync(string provider, string modelName, CancellationToken cancellationToken);
}
