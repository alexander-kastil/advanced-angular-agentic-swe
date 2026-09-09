using System.ComponentModel;
using Microsoft.AspNetCore.Authorization;
using ModelContextProtocol.Server;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;

namespace SecretsMcp.Tools;

[McpServerToolType]
[Authorize(Policy = AuthorizationPolicies.AgentSecrets)]
public sealed class SecretTools(ISecretRepository repository, ISecretListRepository lists)
{
    [McpServerTool(Name = "list_secrets")]
    [Description("Lists the stored secrets, one row per secret: id, the id of the list it belongs to, name, url, user, password, comment, whether the account uses MFA, the version number and when that version was written. Only the highest version of each secret is returned. Pass a list name to see one list, and a search term to filter by name, url, user or comment. Start here to get the name every other tool takes.")]
    public async Task<IReadOnlyList<SecretDto>> ListSecrets(
        [Description("The exact list name as returned by list_secret_lists, for example 'Ext. Resources' or 'Web Accounts'. Omit for every list.")] string? list = null,
        [Description("Optional case-insensitive substring matched against name, url, user and comment. Omit for every secret.")] string? search = null,
        [Description("Maximum number of secrets to return, ordered by list and name. Defaults to 200.")] int limit = 200,
        CancellationToken cancellationToken = default) =>
        await repository.ListAsync(
            list is null ? null : await lists.RequireIdAsync(list, cancellationToken),
            search,
            limit,
            cancellationToken);

    [McpServerTool(Name = "get_secret")]
    [Description("Returns one secret by its exact name within one list. Returns the highest version unless a version number is given. Returns nothing when that list holds no secret of that name.")]
    public async Task<SecretDto?> GetSecret(
        [Description("The exact list name as returned by list_secret_lists.")] string list,
        [Description("The exact secret name as returned by list_secrets.")] string name,
        [Description("A specific version number. Omit for the current, highest version.")] int? version = null,
        CancellationToken cancellationToken = default) =>
        await repository.GetAsync(
            await lists.RequireIdAsync(list, cancellationToken),
            name,
            version,
            cancellationToken);

    [McpServerTool(Name = "list_secret_versions")]
    [Description("Lists every stored version of one secret, newest version first. Each update writes a new version rather than overwriting the previous one, so this is the change history of that secret.")]
    public async Task<IReadOnlyList<SecretDto>> ListSecretVersions(
        [Description("The exact list name as returned by list_secret_lists.")] string list,
        [Description("The exact secret name as returned by list_secrets.")] string name,
        CancellationToken cancellationToken = default) =>
        await repository.ListVersionsAsync(
            await lists.RequireIdAsync(list, cancellationToken),
            name,
            cancellationToken);

    [McpServerTool(Name = "create_secret")]
    [Description("Creates a secret at version 1 in one list. The name is unique within that list: creating a name that list already holds fails, use update_secret instead.")]
    public async Task<SecretDto> CreateSecret(
        [Description("The exact list name as returned by list_secret_lists.")] string list,
        [Description("The name of the resource this secret belongs to, unique within its list.")] string name,
        [Description("The sign-in url of the resource. Optional.")] string? url = null,
        [Description("The user name, account or number used to sign in. Optional.")] string? user = null,
        [Description("The password or credential value used to sign in. Optional.")] string? password = null,
        [Description("Free text holding the credential itself plus any account numbers or notes. Optional.")] string? comment = null,
        [Description("Whether the account is protected by multi-factor authentication. Defaults to false.")] bool mfa = false,
        [Description("The ids of the categories this secret belongs to, as returned by list_categories for the same list. At most 3. Optional.")] Guid[]? categoryIds = null,
        CancellationToken cancellationToken = default) =>
        await repository.CreateAsync(
            new CreateSecretRequest(
                await lists.RequireIdAsync(list, cancellationToken),
                name, url, user, password, comment, mfa, categoryIds),
            cancellationToken);

    [McpServerTool(Name = "update_secret")]
    [Description("Writes a new version of one secret, numbered one higher than its current version. The previous version is kept. Every field is optional: an omitted field is carried over from the current version, and an empty string clears url, user or comment. Passing a new name also renames the secret, rewriting every stored version to the new name; the new name must not already be taken by another secret in the same list and, unlike the other fields, cannot be cleared to empty. A secret cannot be moved to another list.")]
    public async Task<SecretDto> UpdateSecret(
        [Description("The exact list name as returned by list_secret_lists.")] string list,
        [Description("The exact secret name as returned by list_secrets.")] string name,
        [Description("New sign-in url, or an empty string to clear it. Optional.")] string? url = null,
        [Description("New user name, or an empty string to clear it. Optional.")] string? user = null,
        [Description("New password, or an empty string to clear it. Optional.")] string? password = null,
        [Description("New comment, or an empty string to clear it. Optional.")] string? comment = null,
        [Description("New MFA flag. Optional.")] bool? mfa = null,
        [Description("The full replacement set of category ids as returned by list_categories for the same list, at most 3. Replaces every category currently on the secret. Pass an empty array to clear all categories. Optional.")] Guid[]? categoryIds = null,
        [Description("New name for the secret. Must not already be taken by another secret in the same list. Optional.")] string? newName = null,
        CancellationToken cancellationToken = default) =>
        await repository.UpdateAsync(
            await lists.RequireIdAsync(list, cancellationToken),
            name,
            new UpdateSecretRequest(url, user, password, comment, mfa, categoryIds, newName),
            cancellationToken);

    [McpServerTool(Name = "delete_secret")]
    [Description("Deletes one secret from one list by its exact name, including every version of it. The rows are removed outright and cannot be recovered. Returns the number of versions deleted, zero when that list held no secret of that name.")]
    public async Task<int> DeleteSecret(
        [Description("The exact list name as returned by list_secret_lists.")] string list,
        [Description("The exact secret name as returned by list_secrets.")] string name,
        CancellationToken cancellationToken = default) =>
        await repository.DeleteAsync(
            await lists.RequireIdAsync(list, cancellationToken),
            name,
            cancellationToken);
}
