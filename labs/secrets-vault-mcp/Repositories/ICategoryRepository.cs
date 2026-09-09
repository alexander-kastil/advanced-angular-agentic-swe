using SecretsMcp.Contracts;

namespace SecretsMcp.Repositories;

public interface ICategoryRepository
{
    Task<IReadOnlyList<CategoryDto>> ListAsync(Guid? listId, CancellationToken cancellationToken);

    Task<CategoryDto> CreateAsync(CreateCategoryRequest request, CancellationToken cancellationToken);

    Task<CategoryDto?> UpdateAsync(Guid categoryId, UpdateCategoryRequest request, CancellationToken cancellationToken);

    Task<bool> DeleteAsync(Guid categoryId, CancellationToken cancellationToken);
}
