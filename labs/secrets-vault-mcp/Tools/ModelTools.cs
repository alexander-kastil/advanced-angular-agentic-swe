using System.ComponentModel;
using Microsoft.AspNetCore.Authorization;
using ModelContextProtocol.Server;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;

namespace SecretsMcp.Tools;

[McpServerToolType]
[Authorize(Policy = AuthorizationPolicies.AgentModels)]
public sealed class ModelTools(IModelRepository repository)
{
    [McpServerTool(Name = "list_models")]
    [Description("Lists the AI models in the catalogue, the same rows the secrets-ui shows at /ai/models. Each row carries the provider, the model id the provider's API expects, the display name, what the model does, its description, its context window in tokens, its quantization and serving tier, its pricing, whether it accepts image input, its sampling settings, whether it is the single catalogue default, and whether an icon is stored. The icon bytes themselves are never returned. Pass a provider to narrow the list, or omit it for the whole catalogue.")]
    public async Task<IReadOnlyList<ModelSummaryDto>> ListModels(
        [Description("The provider to filter by, for example deepseek or openai. Omit for every provider.")] string? provider = null,
        CancellationToken cancellationToken = default)
    {
        var models = await repository.ListAsync(provider, cancellationToken);
        return [.. models.Select(ToSummary)];
    }

    [McpServerTool(Name = "create_model")]
    [Description("Adds a model to the catalogue. The provider and modelName pair must not already exist. Setting isDefault true makes this the single default across the whole catalogue and clears the flag on whichever model held it. Every capability argument is optional; leave one out to store nothing for it rather than guessing a value.")]
    public async Task<ModelSummaryDto> CreateModel(
        [Description("The provider this model belongs to, for example deepseek or openai.")] string provider,
        [Description("The model id exactly as the provider's API expects it.")] string modelName,
        [Description("The display name shown to a user picking a model.")] string name,
        [Description("Whether the model accepts image input.")] bool supportsVision = false,
        [Description("Sampling temperature, between 0 and 2.")] decimal temperature = 0.2m,
        [Description("The maximum number of tokens the model may generate, or omit for the provider default.")] int? maxTokens = null,
        [Description("Nucleus sampling probability, between 0 and 1, or omit for the provider default.")] decimal? topP = null,
        [Description("Whether this model becomes the single default across the whole catalogue.")] bool isDefault = false,
        [Description("What the model does, as its provider labels it: text-generation, text-to-image, image-to-image, image-to-video or text-to-video.")] string? taskType = null,
        [Description("The provider's own description of the model, plain text.")] string? description = null,
        [Description("The context window in tokens. A provider card showing 1024k means 1048576. Omit for models with no context window.")] int? contextLength = null,
        [Description("The quantization the provider serves, for example fp4, fp8 or bf16.")] string? quantization = null,
        [Description("The serving tier the provider names, for example Flex.")] string? servingTier = null,
        [Description("USD per 1M cached input tokens.")] decimal? priceCachedInPerMillion = null,
        [Description("USD per 1M input tokens.")] decimal? priceInPerMillion = null,
        [Description("USD per 1M output tokens.")] decimal? priceOutPerMillion = null,
        [Description("USD per generated unit for models priced per image or per second of video.")] decimal? pricePerUnit = null,
        [Description("The unit pricePerUnit is measured in, either image or second.")] string? priceUnit = null,
        CancellationToken cancellationToken = default)
    {
        var model = await repository.CreateAsync(
            new CreateModelRequest(
                provider, modelName, name, supportsVision, temperature, maxTokens, topP, isDefault,
                new ModelCapabilities(
                    taskType, description, contextLength, quantization, servingTier,
                    priceCachedInPerMillion, priceInPerMillion, priceOutPerMillion, pricePerUnit, priceUnit)),
            cancellationToken);

        return ToSummary(model);
    }

    [McpServerTool(Name = "update_model")]
    [Description("Updates an existing model, addressed by its provider and modelName pair from list_models. The tuning fields are always written, so pass the current value for anything that should not change. Capability arguments are merged: omit one to keep whatever is stored. Returns null when the pair does not exist.")]
    public async Task<ModelSummaryDto?> UpdateModel(
        [Description("The provider of the model to update, exactly as returned by list_models.")] string provider,
        [Description("The model id of the model to update, exactly as returned by list_models.")] string modelName,
        [Description("The display name shown to a user picking a model.")] string name,
        [Description("Whether the model accepts image input.")] bool supportsVision = false,
        [Description("Sampling temperature, between 0 and 2.")] decimal temperature = 0.2m,
        [Description("The maximum number of tokens the model may generate, or omit for the provider default.")] int? maxTokens = null,
        [Description("Nucleus sampling probability, between 0 and 1, or omit for the provider default.")] decimal? topP = null,
        [Description("Whether this model becomes the single default across the whole catalogue.")] bool isDefault = false,
        [Description("What the model does, as its provider labels it. Omit to keep the stored value.")] string? taskType = null,
        [Description("The provider's own description of the model, plain text. Omit to keep the stored value.")] string? description = null,
        [Description("The context window in tokens. Omit to keep the stored value.")] int? contextLength = null,
        [Description("The quantization the provider serves. Omit to keep the stored value.")] string? quantization = null,
        [Description("The serving tier the provider names. Omit to keep the stored value.")] string? servingTier = null,
        [Description("USD per 1M cached input tokens. Omit to keep the stored value.")] decimal? priceCachedInPerMillion = null,
        [Description("USD per 1M input tokens. Omit to keep the stored value.")] decimal? priceInPerMillion = null,
        [Description("USD per 1M output tokens. Omit to keep the stored value.")] decimal? priceOutPerMillion = null,
        [Description("USD per generated image or per second of video. Omit to keep the stored value.")] decimal? pricePerUnit = null,
        [Description("The unit pricePerUnit is measured in. Omit to keep the stored value.")] string? priceUnit = null,
        CancellationToken cancellationToken = default)
    {
        var model = await repository.UpdateAsync(
            provider,
            modelName,
            new UpdateModelRequest(
                name, supportsVision, temperature, maxTokens, topP, isDefault,
                new ModelCapabilities(
                    taskType, description, contextLength, quantization, servingTier,
                    priceCachedInPerMillion, priceInPerMillion, priceOutPerMillion, pricePerUnit, priceUnit)),
            cancellationToken);

        return model is null ? null : ToSummary(model);
    }

    [McpServerTool(Name = "delete_model")]
    [Description("Removes a model from the catalogue, addressed by its provider and modelName pair from list_models. Returns true when a row was removed and false when the pair did not exist.")]
    public async Task<bool> DeleteModel(
        [Description("The provider of the model to remove, exactly as returned by list_models.")] string provider,
        [Description("The model id of the model to remove, exactly as returned by list_models.")] string modelName,
        CancellationToken cancellationToken = default) =>
        await repository.DeleteAsync(provider, modelName, cancellationToken);

    private static ModelSummaryDto ToSummary(ModelDto m) => new(
        m.Provider,
        m.ModelName,
        m.Name,
        m.SupportsVision,
        m.Temperature,
        m.MaxTokens,
        m.TopP,
        m.IsDefault,
        m.Icon is { Length: > 0 },
        m.Description,
        m.TaskType,
        m.ContextLength,
        m.Quantization,
        m.ServingTier,
        m.PriceCachedInPerMillion,
        m.PriceInPerMillion,
        m.PriceOutPerMillion,
        m.PricePerUnit,
        m.PriceUnit);
}
