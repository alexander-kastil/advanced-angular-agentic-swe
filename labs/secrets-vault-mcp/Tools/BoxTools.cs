using System.ComponentModel;
using Microsoft.AspNetCore.Authorization;
using ModelContextProtocol.Server;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;

namespace SecretsMcp.Tools;

[McpServerToolType]
[Authorize(Policy = AuthorizationPolicies.AgentBoxes)]
public sealed class BoxTools(IBoxRepository repository)
{
    [McpServerTool(Name = "list_boxes")]
    [Description("Lists every VPS in the Hetzner estate this store tracks: name, provider, network identity, role, how many credentials it holds, its apps and display order. The BoxId is a GUID and is what every other box tool takes: there is no lookup by name.")]
    public async Task<IReadOnlyList<BoxDto>> ListBoxes(CancellationToken cancellationToken = default) =>
        await repository.ListAsync(cancellationToken);

    [McpServerTool(Name = "get_box")]
    [Description("Returns one box's full detail: every scalar field including its stack/edge/compose wiring, its computed ssh command, its credentials and its apps.")]
    public async Task<BoxDetailDto?> GetBox(
        [Description("The box id, a GUID from list_boxes. Never a name.")] Guid boxId,
        CancellationToken cancellationToken = default) =>
        await repository.GetByIdAsync(boxId, cancellationToken);

    [McpServerTool(Name = "upsert_box")]
    [Description("Creates a new box when boxId is omitted, or replaces every scalar field of an existing box when boxId is given. Name must be unique across the estate. Credentials and apps are managed separately with upsert_box_credential and upsert_box_app.")]
    public async Task<BoxDetailDto> UpsertBox(
        [Description("Omit to create a new box; pass an existing box's GUID to replace its fields.")] Guid? boxId,
        UpsertBoxRequest request,
        CancellationToken cancellationToken = default)
    {
        if (boxId is null)
        {
            return await repository.CreateAsync(request, cancellationToken);
        }

        return await repository.UpdateAsync(boxId.Value, request, cancellationToken)
            ?? throw new ArgumentException($"Unknown box '{boxId}'.");
    }

    [McpServerTool(Name = "delete_box")]
    [Description("Deletes a box and, through the cascade, every credential and app recorded on it.")]
    public async Task<bool> DeleteBox(
        [Description("The box id, a GUID from list_boxes.")] Guid boxId,
        CancellationToken cancellationToken = default) =>
        await repository.DeleteAsync(boxId, cancellationToken);

    [McpServerTool(Name = "upsert_box_credential")]
    [Description("Creates a new credential on a box when credentialId is omitted, or replaces every field of an existing one when credentialId is given. Label must be unique within the box.")]
    public async Task<BoxCredentialDto> UpsertBoxCredential(
        [Description("The box id, a GUID from list_boxes.")] Guid boxId,
        [Description("Omit to create a new credential; pass an existing credential's GUID to replace its fields.")] Guid? credentialId,
        UpsertBoxCredentialRequest request,
        CancellationToken cancellationToken = default)
    {
        if (credentialId is null)
        {
            return await repository.CreateCredentialAsync(boxId, request, cancellationToken);
        }

        return await repository.UpdateCredentialAsync(boxId, credentialId.Value, request, cancellationToken)
            ?? throw new ArgumentException($"Unknown credential '{credentialId}' on box '{boxId}'.");
    }

    [McpServerTool(Name = "delete_box_credential")]
    [Description("Deletes one credential from a box.")]
    public async Task<bool> DeleteBoxCredential(
        [Description("The box id, a GUID from list_boxes.")] Guid boxId,
        [Description("The credential id, a GUID from get_box.")] Guid credentialId,
        CancellationToken cancellationToken = default) =>
        await repository.DeleteCredentialAsync(boxId, credentialId, cancellationToken);

    [McpServerTool(Name = "upsert_box_app")]
    [Description("Creates a new hosted app on a box when boxAppId is omitted, or replaces every field of an existing one when boxAppId is given. Name must be unique within the box.")]
    public async Task<BoxAppDto> UpsertBoxApp(
        [Description("The box id, a GUID from list_boxes.")] Guid boxId,
        [Description("Omit to create a new app; pass an existing app's GUID to replace its fields.")] Guid? boxAppId,
        UpsertBoxAppRequest request,
        CancellationToken cancellationToken = default)
    {
        if (boxAppId is null)
        {
            return await repository.CreateBoxAppAsync(boxId, request, cancellationToken);
        }

        return await repository.UpdateBoxAppAsync(boxId, boxAppId.Value, request, cancellationToken)
            ?? throw new ArgumentException($"Unknown app '{boxAppId}' on box '{boxId}'.");
    }

    [McpServerTool(Name = "delete_box_app")]
    [Description("Deletes one hosted app from a box.")]
    public async Task<bool> DeleteBoxApp(
        [Description("The box id, a GUID from list_boxes.")] Guid boxId,
        [Description("The box app id, a GUID from get_box.")] Guid boxAppId,
        CancellationToken cancellationToken = default) =>
        await repository.DeleteBoxAppAsync(boxId, boxAppId, cancellationToken);
}
