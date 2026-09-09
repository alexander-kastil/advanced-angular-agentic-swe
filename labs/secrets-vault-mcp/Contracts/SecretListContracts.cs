using System.ComponentModel;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Contracts;

public sealed record SecretListDto(Guid ListId, string Name, string? Description, SecretListType Type, int SecretCount);

public sealed record CreateSecretListRequest(
    [property: Description("The display name of the list. Must not already be taken across the store.")] string Name,
    [property: Description("A short description of what the list holds, or omit to leave it blank.")] string? Description,
    [property: Description("The kind of list: 1 for Secrets, 2 for Vault. Omit for Secrets.")] SecretListType Type = SecretListType.Secrets);

public sealed record UpdateSecretListRequest(
    [property: Description("The new display name of the list. Must not already be taken by another list.")] string Name,
    [property: Description("The new description of what the list holds, or an empty string to clear it.")] string? Description);
