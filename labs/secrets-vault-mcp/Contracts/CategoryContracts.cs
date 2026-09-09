using System.ComponentModel;

namespace SecretsMcp.Contracts;

public sealed record CategoryDto(Guid CategoryId, Guid ListId, string Topic, string Color, int SecretCount);

public sealed record CreateCategoryRequest(
    [property: Description("The guid of the list this category belongs to, as returned by list_secret_lists.")] Guid ListId,
    [property: Description("The display name of the category. Must not already be taken within its list.")] string Topic,
    [property: Description("The display color as a hex value, for example #2d7fd9.")] string Color);

public sealed record UpdateCategoryRequest(
    [property: Description("The new display name, or omit to keep the current one.")] string? Topic,
    [property: Description("The new display color as a hex value, or omit to keep the current one.")] string? Color);
