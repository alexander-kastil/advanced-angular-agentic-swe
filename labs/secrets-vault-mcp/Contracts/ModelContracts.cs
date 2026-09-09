using System.ComponentModel;

namespace SecretsMcp.Contracts;

public sealed record ModelDto(
    string Provider,
    string ModelName,
    string Name,
    bool SupportsVision,
    decimal Temperature,
    int? MaxTokens,
    decimal? TopP,
    bool IsDefault,
    byte[]? Icon,
    string? IconContentType,
    string? Description,
    string? TaskType,
    int? ContextLength,
    string? Quantization,
    string? ServingTier,
    decimal? PriceCachedInPerMillion,
    decimal? PriceInPerMillion,
    decimal? PriceOutPerMillion,
    decimal? PricePerUnit,
    string? PriceUnit);

public sealed record ModelSummaryDto(
    string Provider,
    string ModelName,
    string Name,
    bool SupportsVision,
    decimal Temperature,
    int? MaxTokens,
    decimal? TopP,
    bool IsDefault,
    bool HasIcon,
    string? Description,
    string? TaskType,
    int? ContextLength,
    string? Quantization,
    string? ServingTier,
    decimal? PriceCachedInPerMillion,
    decimal? PriceInPerMillion,
    decimal? PriceOutPerMillion,
    decimal? PricePerUnit,
    string? PriceUnit);

public sealed record ModelCapabilities(
    [property: Description("What the model does, as its provider labels it: text-generation, text-to-image, image-to-image, image-to-video or text-to-video. Omit to leave unchanged.")] string? TaskType = null,
    [property: Description("The provider's own description of the model, plain text. Omit to leave unchanged.")] string? Description = null,
    [property: Description("The context window in tokens. A card showing 1024k means 1048576. Omit for models with no context window.")] int? ContextLength = null,
    [property: Description("The quantization the provider serves, for example fp4, fp8 or bf16. Omit when the provider states none.")] string? Quantization = null,
    [property: Description("The serving tier the provider names, for example Flex. Omit when the provider names none.")] string? ServingTier = null,
    [property: Description("USD per 1M cached input tokens. Omit for models not priced per token.")] decimal? PriceCachedInPerMillion = null,
    [property: Description("USD per 1M input tokens. Omit for models not priced per token.")] decimal? PriceInPerMillion = null,
    [property: Description("USD per 1M output tokens. Omit for models not priced per token.")] decimal? PriceOutPerMillion = null,
    [property: Description("USD per generated unit for models priced per image or per second of video. Omit for token-priced models.")] decimal? PricePerUnit = null,
    [property: Description("The unit PricePerUnit is measured in, either image or second. Omit for token-priced models.")] string? PriceUnit = null);

public sealed record CreateModelRequest(
    [property: Description("The provider this model belongs to, for example deepseek or openai.")] string Provider,
    [property: Description("The model id exactly as the provider's API expects it.")] string ModelName,
    [property: Description("The display name shown to a user picking a model.")] string Name,
    [property: Description("Whether the model accepts image input.")] bool SupportsVision,
    [property: Description("Sampling temperature, between 0 and 2.")] decimal Temperature,
    [property: Description("The maximum number of tokens the model may generate, or null for the provider default.")] int? MaxTokens,
    [property: Description("Nucleus sampling probability, between 0 and 1, or null for the provider default.")] decimal? TopP,
    [property: Description("Whether this model is the single default across the whole catalogue.")] bool IsDefault,
    [property: Description("The model's description, task type, context window, quantization, serving tier and pricing. Null leaves every capability unset.")] ModelCapabilities? Capabilities = null);

public sealed record UpdateModelRequest(
    [property: Description("The display name shown to a user picking a model.")] string Name,
    [property: Description("Whether the model accepts image input.")] bool SupportsVision,
    [property: Description("Sampling temperature, between 0 and 2.")] decimal Temperature,
    [property: Description("The maximum number of tokens the model may generate, or null for the provider default.")] int? MaxTokens,
    [property: Description("Nucleus sampling probability, between 0 and 1, or null for the provider default.")] decimal? TopP,
    [property: Description("Whether this model is the single default across the whole catalogue.")] bool IsDefault,
    [property: Description("The model's description, task type, context window, quantization, serving tier and pricing. Null leaves every capability unchanged.")] ModelCapabilities? Capabilities = null);
