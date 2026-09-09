using Microsoft.EntityFrameworkCore;
using SecretsMcp.Contracts;
using SecretsMcp.Data;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Repositories;

public sealed class ModelRepository(IDbContextFactory<SecretsDbContext> contextFactory) : IModelRepository
{
    public async Task<IReadOnlyList<ModelDto>> ListAsync(string? provider, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var query = db.Models.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(provider))
        {
            query = query.Where(m => m.Provider == provider);
        }

        return await query
            .OrderBy(m => m.Provider).ThenBy(m => m.ModelName)
            .Select(m => new ModelDto(
                m.Provider, m.ModelName, m.Name, m.SupportsVision, m.Temperature, m.MaxTokens, m.TopP, m.IsDefault,
                m.Icon, m.IconContentType, m.Description, m.TaskType, m.ContextLength, m.Quantization, m.ServingTier,
                m.PriceCachedInPerMillion, m.PriceInPerMillion, m.PriceOutPerMillion, m.PricePerUnit, m.PriceUnit))
            .ToListAsync(cancellationToken);
    }

    public async Task<ModelDto> CreateAsync(CreateModelRequest request, CancellationToken cancellationToken)
    {
        var provider = (request.Provider ?? "").Trim();
        var modelName = (request.ModelName ?? "").Trim();
        var name = (request.Name ?? "").Trim();

        if (provider.Length == 0)
        {
            throw new ArgumentException("Provider must not be empty.");
        }

        if (modelName.Length == 0)
        {
            throw new ArgumentException("ModelName must not be empty.");
        }

        if (name.Length == 0)
        {
            throw new ArgumentException("Name must not be empty.");
        }

        ValidateTuning(request.Temperature, request.TopP, request.MaxTokens);

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        if (await db.Models.AnyAsync(m => m.Provider == provider && m.ModelName == modelName, cancellationToken))
        {
            throw new InvalidOperationException($"Model '{modelName}' already exists for provider '{provider}'.");
        }

        if (request.IsDefault)
        {
            await ClearDefaultsAsync(db, cancellationToken);
        }

        var model = new Model
        {
            Provider = provider,
            ModelName = modelName,
            Name = name,
            SupportsVision = request.SupportsVision,
            Temperature = request.Temperature,
            MaxTokens = request.MaxTokens,
            TopP = request.TopP,
            IsDefault = request.IsDefault
        };

        ApplyCapabilities(model, request.Capabilities);

        db.Models.Add(model);
        await db.SaveChangesAsync(cancellationToken);

        return ToDto(model);
    }

    public async Task<ModelDto?> UpdateAsync(
        string provider,
        string modelName,
        UpdateModelRequest request,
        CancellationToken cancellationToken)
    {
        var name = (request.Name ?? "").Trim();

        if (name.Length == 0)
        {
            throw new ArgumentException("Name must not be empty.");
        }

        ValidateTuning(request.Temperature, request.TopP, request.MaxTokens);

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var model = await db.Models.FirstOrDefaultAsync(
            m => m.Provider == provider && m.ModelName == modelName, cancellationToken);

        if (model is null)
        {
            return null;
        }

        if (request.IsDefault && !model.IsDefault)
        {
            await ClearDefaultsAsync(db, cancellationToken);
        }

        model.Name = name;
        model.SupportsVision = request.SupportsVision;
        model.Temperature = request.Temperature;
        model.MaxTokens = request.MaxTokens;
        model.TopP = request.TopP;
        model.IsDefault = request.IsDefault;

        ApplyCapabilities(model, request.Capabilities);

        await db.SaveChangesAsync(cancellationToken);

        return ToDto(model);
    }

    public async Task<bool> DeleteAsync(string provider, string modelName, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var model = await db.Models.FirstOrDefaultAsync(
            m => m.Provider == provider && m.ModelName == modelName, cancellationToken);

        if (model is null)
        {
            return false;
        }

        db.Models.Remove(model);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static void ValidateTuning(decimal temperature, decimal? topP, int? maxTokens)
    {
        if (temperature < 0m || temperature > 2m)
        {
            throw new ArgumentException("Temperature must be between 0 and 2.");
        }

        if (topP is < 0m or > 1m)
        {
            throw new ArgumentException("TopP must be between 0 and 1.");
        }

        if (maxTokens is <= 0)
        {
            throw new ArgumentException("MaxTokens must be greater than 0.");
        }
    }

    private static async Task ClearDefaultsAsync(SecretsDbContext db, CancellationToken cancellationToken)
    {
        var currentDefaults = await db.Models.Where(m => m.IsDefault).ToListAsync(cancellationToken);

        foreach (var current in currentDefaults)
        {
            current.IsDefault = false;
        }
    }

    private static void ApplyCapabilities(Model model, ModelCapabilities? capabilities)
    {
        if (capabilities is null)
        {
            return;
        }

        model.TaskType = capabilities.TaskType ?? model.TaskType;
        model.Description = capabilities.Description ?? model.Description;
        model.ContextLength = capabilities.ContextLength ?? model.ContextLength;
        model.Quantization = capabilities.Quantization ?? model.Quantization;
        model.ServingTier = capabilities.ServingTier ?? model.ServingTier;
        model.PriceCachedInPerMillion = capabilities.PriceCachedInPerMillion ?? model.PriceCachedInPerMillion;
        model.PriceInPerMillion = capabilities.PriceInPerMillion ?? model.PriceInPerMillion;
        model.PriceOutPerMillion = capabilities.PriceOutPerMillion ?? model.PriceOutPerMillion;
        model.PricePerUnit = capabilities.PricePerUnit ?? model.PricePerUnit;
        model.PriceUnit = capabilities.PriceUnit ?? model.PriceUnit;
    }

    private static ModelDto ToDto(Model model) => new(
        model.Provider, model.ModelName, model.Name, model.SupportsVision,
        model.Temperature, model.MaxTokens, model.TopP, model.IsDefault,
        model.Icon, model.IconContentType, model.Description, model.TaskType,
        model.ContextLength, model.Quantization, model.ServingTier,
        model.PriceCachedInPerMillion, model.PriceInPerMillion, model.PriceOutPerMillion,
        model.PricePerUnit, model.PriceUnit);
}
