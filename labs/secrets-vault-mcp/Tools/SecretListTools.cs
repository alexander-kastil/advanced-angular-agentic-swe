using System.ComponentModel;
using Microsoft.AspNetCore.Authorization;
using ModelContextProtocol.Server;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Data.Entities;
using SecretsMcp.Repositories;

namespace SecretsMcp.Tools;

[McpServerToolType]
[Authorize(Policy = AuthorizationPolicies.AgentLists)]
public sealed class SecretListTools(ISecretListRepository repository)
{
    [McpServerTool(Name = "list_secret_lists")]
    [Description("Lists the secret lists the store is split into, each with its list guid, its name, its optional description of what the list holds and how many secrets it holds. A secret and a category always belong to exactly one list, and a secret name is unique within its list rather than across the store. Start here to get the listId every other tool takes.")]
    public async Task<IReadOnlyList<SecretListDto>> ListSecretLists(CancellationToken cancellationToken = default) =>
        await repository.ListAsync(cancellationToken);

    [McpServerTool(Name = "create_secret_list")]
    [Description("Creates a new secret list. The name must not already be taken across the store.")]
    public async Task<SecretListDto> CreateSecretList(
        [Description("The display name of the list. Must not already be taken across the store.")] string name,
        [Description("A short description of what the list holds. Optional.")] string? description = null,
        [Description("The kind of list: 1 for Secrets, 2 for Vault. Defaults to Secrets.")] SecretListType type = SecretListType.Secrets,
        CancellationToken cancellationToken = default) =>
        await repository.CreateAsync(new CreateSecretListRequest(name, description, type), cancellationToken);

    [McpServerTool(Name = "delete_secret_list")]
    [Description("Deletes one secret list by its exact name, together with every secret it holds, every version of those secrets, and their category assignments. The rows are removed outright and cannot be recovered. Returns the number of secrets deleted.")]
    public async Task<int> DeleteSecretList(
        [Description("The exact list name as returned by list_secret_lists.")] string list,
        CancellationToken cancellationToken = default)
    {
        var listId = await repository.RequireIdAsync(list, cancellationToken);
        return await repository.DeleteAsync(listId, cancellationToken) ?? 0;
    }
}
