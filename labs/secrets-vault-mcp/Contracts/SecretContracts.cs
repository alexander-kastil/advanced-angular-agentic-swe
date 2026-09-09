using System.ComponentModel;

namespace SecretsMcp.Contracts;

public sealed record SecretDto(
    Guid SecretId,
    Guid ListId,
    string Name,
    string? Url,
    string? User,
    string? Password,
    string? Comment,
    bool Mfa,
    IReadOnlyList<Guid> CategoryIds,
    int Version,
    DateTime LastChanged,
    string? FileName,
    string? ContentType,
    long? FileSize);

public sealed record VaultFileContent(byte[] Content, string ContentType, string FileName);

public sealed record CreateSecretRequest(
    [property: Description("The guid of the list this secret belongs to, as returned by list_secret_lists.")] Guid ListId,
    [property: Description("The name of the resource this secret belongs to. Unique within its list.")] string Name,
    [property: Description("The sign-in url of the resource. Optional.")] string? Url,
    [property: Description("The user name, account or number used to sign in. Optional.")] string? User,
    [property: Description("The password or credential value used to sign in. Optional.")] string? Password,
    [property: Description("Free text holding the credential itself plus any account numbers or notes. Optional.")] string? Comment,
    [property: Description("Whether the account is protected by multi-factor authentication.")] bool Mfa,
    [property: Description("The ids of the categories this secret belongs to, at most 3. Optional.")] IReadOnlyList<Guid>? CategoryIds);

public sealed record RenameSecretRequest(
    [property: Description("The new name for the secret. Must not already be taken by another secret in the same list.")] string NewName);

public sealed record UpdateSecretRequest(
    [property: Description("New sign-in url, or an empty string to clear it. Omit to keep the current one.")] string? Url,
    [property: Description("New user name, or an empty string to clear it. Omit to keep the current one.")] string? User,
    [property: Description("New password, or an empty string to clear it. Omit to keep the current one.")] string? Password,
    [property: Description("New comment, or an empty string to clear it. Omit to keep the current one.")] string? Comment,
    [property: Description("New MFA flag. Omit to keep the current one.")] bool? Mfa,
    [property: Description("The full replacement set of category ids, at most 3, or an empty array to clear them. Omit to keep the current set.")] IReadOnlyList<Guid>? CategoryIds,
    [property: Description("New name, or omit to keep the current one. Must not already be taken by another secret in the same list; a secret must always have a name, so an empty or whitespace-only value is rejected.")] string? Name = null);
