using Microsoft.EntityFrameworkCore;
using SecretsMcp.Contracts;
using SecretsMcp.Data;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Repositories;

public sealed class CategoryRepository(IDbContextFactory<SecretsDbContext> contextFactory) : ICategoryRepository
{
    public async Task<IReadOnlyList<CategoryDto>> ListAsync(Guid? listId, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var query = db.Categories.AsNoTracking();

        if (listId is not null)
        {
            query = query.Where(c => c.ListId == listId);
        }

        return await query
            .OrderBy(c => c.ListId).ThenBy(c => c.CategoryId)
            .Select(c => new CategoryDto(
                c.CategoryId,
                c.ListId,
                c.Topic,
                c.Color,
                db.SecretCategories.Count(sc => sc.CategoryId == c.CategoryId)))
            .ToListAsync(cancellationToken);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryRequest request, CancellationToken cancellationToken)
    {
        var topic = (request.Topic ?? "").Trim();
        var color = (request.Color ?? "").Trim();

        if (topic.Length == 0)
        {
            throw new ArgumentException("Topic must not be empty.");
        }

        if (color.Length == 0)
        {
            throw new ArgumentException("Color must not be empty.");
        }

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        if (!await db.SecretLists.AnyAsync(l => l.ListId == request.ListId, cancellationToken))
        {
            throw new ArgumentException($"Unknown list id: {request.ListId}.");
        }

        if (await db.Categories.AnyAsync(c => c.ListId == request.ListId && c.Topic == topic, cancellationToken))
        {
            throw new InvalidOperationException($"A category named '{topic}' already exists in this list.");
        }

        var category = new Category
        {
            CategoryId = Guid.CreateVersion7(),
            ListId = request.ListId,
            Topic = topic,
            Color = color
        };
        db.Categories.Add(category);
        await db.SaveChangesAsync(cancellationToken);

        return new CategoryDto(category.CategoryId, category.ListId, category.Topic, category.Color, 0);
    }

    public async Task<CategoryDto?> UpdateAsync(
        Guid categoryId,
        UpdateCategoryRequest request,
        CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var category = await db.Categories.FirstOrDefaultAsync(c => c.CategoryId == categoryId, cancellationToken);
        if (category is null)
        {
            return null;
        }

        var topic = request.Topic?.Trim();
        if (topic is { Length: > 0 } && topic != category.Topic)
        {
            if (await db.Categories.AnyAsync(
                    c => c.ListId == category.ListId && c.Topic == topic && c.CategoryId != categoryId,
                    cancellationToken))
            {
                throw new InvalidOperationException($"A category named '{topic}' already exists in this list.");
            }

            category.Topic = topic;
        }

        var color = request.Color?.Trim();
        if (color is { Length: > 0 })
        {
            category.Color = color;
        }

        await db.SaveChangesAsync(cancellationToken);

        var used = await db.SecretCategories.CountAsync(sc => sc.CategoryId == categoryId, cancellationToken);
        return new CategoryDto(category.CategoryId, category.ListId, category.Topic, category.Color, used);
    }

    public async Task<bool> DeleteAsync(Guid categoryId, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var category = await db.Categories.FirstOrDefaultAsync(c => c.CategoryId == categoryId, cancellationToken);
        if (category is null)
        {
            return false;
        }

        if (await db.SecretCategories.AnyAsync(sc => sc.CategoryId == categoryId, cancellationToken))
        {
            throw new InvalidOperationException("The category is still assigned to at least one secret.");
        }

        db.Categories.Remove(category);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
