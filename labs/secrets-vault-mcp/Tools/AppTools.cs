using System.ComponentModel;
using Microsoft.AspNetCore.Authorization;
using ModelContextProtocol.Server;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;

namespace SecretsMcp.Tools;

[McpServerToolType]
[Authorize(Policy = AuthorizationPolicies.AgentApps)]
public sealed class AppTools(IAppRepository repository)
{
    [McpServerTool(Name = "list_repos")]
    [Description("Lists the repositories whose apps and settings this store holds, each with its id, its local path and how many apps and settings it carries. The RepoId is a GUID and is what list_apps and every other repository-scoped tool takes: there is no slug and no lookup by name.")]
    public async Task<IReadOnlyList<RepoDto>> ListRepos(CancellationToken cancellationToken = default) =>
        await repository.ListReposAsync(cancellationToken);

    [McpServerTool(Name = "list_environments")]
    [Description("Lists the environments an app is deployed to: dev, blue and green, each with its id, name, type and display order. The EnvironmentId is a GUID and is what every environment argument on the other tools takes: the type name 'dev' is not accepted anywhere.")]
    public async Task<IReadOnlyList<EnvironmentDto>> ListEnvironments(CancellationToken cancellationToken = default) =>
        await repository.ListEnvironmentsAsync(cancellationToken);

    [McpServerTool(Name = "list_apps")]
    [Description("Lists the apps of one repository in one environment: each app's id, its kind (api, ui, mcp, cli, agent, site, team or app), how many settings it declares, how many of them carry a value in that environment, and the files it writes there. Returns names and counts only. For the settings themselves use get_app_settings.")]
    public async Task<IReadOnlyList<AppSummaryDto>> ListApps(
        [Description("The repository id, a GUID from list_repos. Never a name and never a slug.")] Guid repoId,
        [Description("The environment id, a GUID from list_environments. Omit for the development environment.")] Guid? environmentId = null,
        CancellationToken cancellationToken = default)
    {
        var repo = await repository.GetRepoEnvironmentAsync(repoId, environmentId, cancellationToken);
        return repo?.Apps ?? [];
    }

    [McpServerTool(Name = "get_app_settings")]
    [Description("Returns one app's settings for one environment: every setting with its canonical name, the key path and value that environment's file writes, the file it is written to, and the same value in every other environment side by side. A credential is never returned: a setting that carries one holds a ${secret:NAME} marker and names the secret, which is read with get_secret.")]
    public async Task<AppSettingsDto?> GetAppSettings(
        [Description("The app id, a GUID from list_apps. Never a name.")] Guid appId,
        [Description("The environment id, a GUID from list_environments. Omit for the development environment.")] Guid? environmentId = null,
        CancellationToken cancellationToken = default) =>
        await repository.GetAppSettingsAsync(appId, environmentId, cancellationToken);

    [McpServerTool(Name = "create_setting")]
    [Description("Declares a setting on one app. The name is the canonical logical name using ':' separators and is unique within the app. Creating it materializes one value row in every environment, empty until set_setting_value fills them, so a setting always exists everywhere the app is deployed.")]
    public async Task<SettingRowDto> CreateSetting(
        [Description("The app id, a GUID from list_apps. Never a name.")] Guid appId,
        CreateSettingRequest request,
        CancellationToken cancellationToken = default) =>
        await repository.CreateSettingAsync(appId, request, cancellationToken);

    [McpServerTool(Name = "set_setting_value")]
    [Description("Sets one setting's value in one environment, together with the key path that environment's file writes and the target file it belongs to. The value must not be a credential: store the credential as a secret.")]
    public async Task<SettingRowDto> SetSettingValue(
        [Description("The setting id, a GUID from get_app_settings. Never a key or a name.")] Guid settingId,
        [Description("The environment id, a GUID from list_environments. Never the type name dev, blue or green.")] Guid environmentId,
        SetSettingValueRequest request,
        CancellationToken cancellationToken = default) =>
        await repository.SetSettingValueAsync(settingId, environmentId, request, cancellationToken);

    [McpServerTool(Name = "import_app_env")]
    [Description("Reads a file's KEY=value lines into one app's settings for one environment, creating the settings it does not yet hold and updating the values of those it does. Replace clears that environment's existing values for the file first. Use diff_app_env to see what would change before importing.")]
    public async Task<int> ImportAppEnv(
        [Description("The app id, a GUID from list_apps. Never a name.")] Guid appId,
        ImportRequest request,
        CancellationToken cancellationToken = default) =>
        await repository.ImportAsync(appId, request, cancellationToken);

    [McpServerTool(Name = "diff_app_env")]
    [Description("Compares a file's KEYS against what the store holds for one app, one environment and one file path, and reports which keys are only in the file and which only in the store. Values are never compared and never returned. The file stays the source of truth; this reports drift rather than resolving it, unlike import_app_env which writes.")]
    public async Task<DiffDto> DiffAppEnv(
        [Description("The app id, a GUID from list_apps. Never a name.")] Guid appId,
        DiffRequest request,
        CancellationToken cancellationToken = default) =>
        await repository.DiffAsync(appId, request, cancellationToken);

    [McpServerTool(Name = "render_app_env")]
    [Description("Renders one app's settings for one environment and one file path back as file text, in the store's order. A secret-linked setting renders its ${secret:NAME} marker, never the credential.")]
    public async Task<string> RenderAppEnv(
        [Description("The app id, a GUID from list_apps. Never a name.")] Guid appId,
        [Description("The environment id, a GUID from list_environments. Never the type name dev, blue or green.")] Guid environmentId,
        [Description("Path of the file to render, one of the app's target file paths from get_app_settings.")] string filePath,
        CancellationToken cancellationToken = default) =>
        await repository.RenderAsync(appId, environmentId, filePath, cancellationToken);
}
