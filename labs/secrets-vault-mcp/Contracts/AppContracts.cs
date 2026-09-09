using System.ComponentModel;

namespace SecretsMcp.Contracts;

public sealed record EnvironmentDto(
    Guid EnvironmentId,
    string Name,
    string Type,
    int Ordinal);

public sealed record RepoDto(
    Guid RepoId,
    string Name,
    string? LocalPath,
    string? RemoteUrl,
    int AppCount,
    int SettingCount,
    DateTime LastChanged);

public sealed record AppRegistrationDto(
    Guid AppId,
    string DisplayName,
    Guid? ClientId,
    Guid? TenantId,
    Guid? ObjectId,
    string? SignInAudience,
    string? Notes,
    bool HasManifest,
    DateTime LastChanged);

public sealed record AppSummaryDto(
    Guid AppId,
    string Name,
    string Kind,
    Guid? BoxId,
    string? BoxName,
    int Ordinal,
    int SettingCount,
    int FilledCount,
    IReadOnlyList<string> FilePaths,
    AppRegistrationDto? Registration);

public sealed record RepoEnvironmentDto(
    Guid RepoId,
    string Name,
    Guid EnvironmentId,
    string Environment,
    IReadOnlyList<AppSummaryDto> Apps);

public sealed record SettingValueDto(
    Guid EnvironmentId,
    string Environment,
    string KeyPath,
    string? Value,
    bool IsPlaceholder,
    Guid? SecretListId,
    string? SecretName);

public sealed record SettingRowDto(
    Guid SettingId,
    string Name,
    bool IsSecret,
    string? Comment,
    int Ordinal,
    Guid? TargetId,
    string? FilePath,
    SettingValueDto Value,
    IReadOnlyList<SettingValueDto> AllEnvironments);

public sealed record AppTargetDto(
    Guid TargetId,
    Guid EnvironmentId,
    string FilePath,
    int Ordinal);

public sealed record AppSettingsDto(
    Guid AppId,
    Guid RepoId,
    string Name,
    string Kind,
    Guid EnvironmentId,
    string Environment,
    IReadOnlyList<AppTargetDto> Targets,
    IReadOnlyList<SettingRowDto> Settings);

public sealed record ExportFileDto(
    Guid AppId,
    string AppName,
    string? FilePath,
    string Content);

public sealed record ExportDto(
    Guid RepoId,
    string Name,
    Guid EnvironmentId,
    string Environment,
    IReadOnlyList<ExportFileDto> Files);

public sealed record DiffRowDto(
    Guid EnvironmentId,
    string Environment,
    string FilePath,
    string Key,
    string State,
    string? Detail);

public sealed record DiffDto(
    Guid AppId,
    Guid EnvironmentId,
    string Environment,
    string FilePath,
    int StoreKeys,
    int FileKeys,
    int Agree,
    IReadOnlyList<DiffRowDto> Rows);

public sealed record RegisterRepoRequest(
    [property: Description("The repository's display name, unique across the store, for example integrations.at.")] string Name,
    [property: Description("Absolute path to the working copy on this machine, or omit.")] string? LocalPath,
    [property: Description("Remote clone URL, or omit.")] string? RemoteUrl);

public sealed record UpdateRepoRequest(
    [property: Description("The repository's display name, unique across the store, for example integrations.at.")] string Name,
    [property: Description("Absolute path to the working copy on this machine, or omit.")] string? LocalPath,
    [property: Description("Remote clone URL, or omit.")] string? RemoteUrl);

public sealed record CreateAppRequest(
    [property: Description("The repository this app belongs to, as a GUID id from list_repos. Never a name and never a slug.")] Guid RepoId,
    [property: Description("The app's name, unique within its repository, for example secrets-mcp or worktime-ui.")] string Name,
    [property: Description("What the app is: api, ui, mcp, cli, agent, site, team or app.")] string Kind);

public sealed record SetAppTargetRequest(
    [property: Description("Path of the file this app writes its settings into for this environment, relative to the repository root or prefixed for a remote box, for example src/secrets-mcp/appsettings.json.")] string FilePath);

public sealed record SetAppOrdinalRequest(
    [property: Description("New position within the repository's app list.")] int Ordinal);

public sealed record SetAppNameRequest(string Name);

public sealed record SetAppBoxRequest(
    [property: Description("Id of the box this app runs on, or null to clear the assignment.")] Guid? BoxId);

public sealed record SetAppRegistrationRequest(
    [property: Description("The Entra app registration's display name as shown in the Azure portal.")] string DisplayName,
    [property: Description("The application (client) ID GUID, or omit if not yet known.")] Guid? ClientId,
    [property: Description("The Entra tenant ID GUID this registration lives in, or omit if not yet known.")] Guid? TenantId,
    [property: Description("The registration's object ID GUID, or omit if not yet known.")] Guid? ObjectId,
    [property: Description("The sign-in audience, for example AzureADMyOrg or AzureADMultipleOrgs, or omit.")] string? SignInAudience,
    [property: Description("A free-text note about this registration, or omit.")] string? Notes);

public sealed record CreateSettingRequest(
    [property: Description("The setting's canonical logical name using ':' separators, unique within the app, for example ConnectionStrings:Secrets.")] string Name,
    [property: Description("Whether this setting holds a credential. Credentials are stored as secret links, never as values.")] bool IsSecret,
    [property: Description("A note about the setting, at most two lines, or omit.")] string? Comment,
    [property: Description("Position within the app, used to order a rendered file. Omit to append.")] int? Ordinal);

public sealed record SetSettingValueRequest(
    [property: Description("The literal key as this environment's file writes it: ':' separators in appsettings json, '__' in container env files.")] string KeyPath,
    [property: Description("The literal value. Must NOT be a credential.")] string? Value,
    [property: Description("Whether the value is safe to write into a committed mirror. Defaults to false.")] bool IsPlaceholder,
    [property: Description("The app target this value is written to, as a GUID id from get_app_settings. Never a file path. Omit to leave the value unfiled.")] Guid? TargetId);

public sealed record ImportRequest(
    [property: Description("The environment every imported key is filed under, as a GUID id from list_environments. Never the type name dev, blue or green.")] Guid EnvironmentId,
    [property: Description("Path of the file the content came from, matching an app target for this environment.")] string FilePath,
    [property: Description("The whole file as text, KEY=value lines with # comments.")] string Content,
    [property: Description("Delete this environment's existing values for this file first. Defaults to false, which merges.")] bool Replace = false);

public sealed record DiffRequest(
    [property: Description("The environment to compare, as a GUID id from list_environments. Never the type name dev, blue or green.")] Guid EnvironmentId,
    [property: Description("Path of the file the content came from, matching an app target for this environment.")] string FilePath,
    [property: Description("The file as text. Keys are compared; values never are.")] string Content);

public sealed record GitHubStatusDto(
    [property: Description("Whether GitHub:ClientId is configured for the device flow.")] bool Configured,
    [property: Description("Whether a GitHub token is currently stored.")] bool Connected,
    [property: Description("The connected GitHub login, or null when not connected.")] string? Login);

public sealed record DeviceStartDto(
    [property: Description("The opaque device code the caller sends back to device/poll.")] string DeviceCode,
    [property: Description("The short code the user enters at the verification URI.")] string UserCode,
    [property: Description("Where the user authorizes the device, for example https://github.com/login/device.")] string VerificationUri,
    [property: Description("Seconds until the device code expires.")] int ExpiresIn,
    [property: Description("Minimum seconds to wait between polls.")] int Interval);

public sealed record DevicePollRequest(
    [property: Description("The device code returned by device/start.")] string? DeviceCode);

public sealed record DevicePollDto(
    [property: Description("One of pending, slow_down, connected, denied or expired.")] string Status,
    [property: Description("The connected GitHub login, set only when Status is connected.")] string? Login,
    [property: Description("Seconds to wait before the next poll.")] int Interval);

public sealed record GitHubRepoDto(
    [property: Description("owner/name, for example alexander-kastil/integrations.at.")] string FullName,
    [property: Description("The repository's name without its owner.")] string Name,
    [property: Description("The login of the repository's owner.")] string OwnerLogin,
    [property: Description("The repository's description, or null.")] string? Description,
    [property: Description("Whether the repository is private.")] bool Private,
    [property: Description("The repository's default branch, for example main.")] string DefaultBranch,
    [property: Description("The repository's GitHub URL.")] string HtmlUrl,
    [property: Description("When the repository was last updated on GitHub.")] DateTime UpdatedUtc);

public sealed record DatabaseUsageDto(
    string Database,
    Guid AppId,
    string AppName,
    Guid EnvironmentId,
    string Environment);
