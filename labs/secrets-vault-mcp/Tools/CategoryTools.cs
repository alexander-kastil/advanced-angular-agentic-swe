using System.ComponentModel;
using Microsoft.AspNetCore.Authorization;
using ModelContextProtocol.Server;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;

namespace SecretsMcp.Tools;

[McpServerToolType]
[Authorize(Policy = AuthorizationPolicies.AgentCategories)]
public sealed class CategoryTools(ICategoryRepository repository, ISecretListRepository lists)
{
    [McpServerTool(Name = "list_categories")]
    [Description("Lists the categories a secret can belong to. Categories are per list: each row carries the category id, the id of the list it belongs to, and its display color. A secret may only carry categories from its own list. Pass a list name to see one list's categories, or omit it for every list. create_secret and update_secret take a set of up to 3 of these ids in their categoryIds parameter.")]
    public async Task<IReadOnlyList<CategoryDto>> ListCategories(
        [Description("The exact list name as returned by list_secret_lists, for example 'Ext. Resources' or 'Web Accounts'. Omit for every list.")] string? list = null,
        CancellationToken cancellationToken = default) =>
        await repository.ListAsync(
            list is null ? null : await lists.RequireIdAsync(list, cancellationToken),
            cancellationToken);
}
