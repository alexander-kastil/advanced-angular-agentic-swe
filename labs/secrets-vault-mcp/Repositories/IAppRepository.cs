using SecretsMcp.Contracts;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Repositories;

public interface IAppRepository
{
    Task<IReadOnlyList<EnvironmentDto>> ListEnvironmentsAsync(CancellationToken cancellationToken);

    Task MaterializeEveryValueAsync(CancellationToken cancellationToken);

    Task<IReadOnlyList<RepoDto>> ListReposAsync(CancellationToken cancellationToken);

    Task<RepoDto> RegisterRepoAsync(RegisterRepoRequest request, CancellationToken cancellationToken);

    Task<IReadOnlyList<DatabaseUsageDto>> ListDatabasesAsync(CancellationToken cancellationToken);

    Task<RepoDto?> UpdateRepoAsync(Guid repoId, UpdateRepoRequest request, CancellationToken cancellationToken);

    Task<RepoEnvironmentDto?> GetRepoEnvironmentAsync(Guid repoId, Guid? environmentId, CancellationToken cancellationToken);

    Task<ExportDto> ExportRepoAsync(Guid repoId, Guid? environmentId, CancellationToken cancellationToken);

    Task<AppSummaryDto> CreateAppAsync(CreateAppRequest request, CancellationToken cancellationToken);

    Task<AppSettingsDto?> GetAppSettingsAsync(Guid appId, Guid? environmentId, CancellationToken cancellationToken);

    Task<AppTargetDto> SetAppTargetAsync(Guid appId, Guid environmentId, string filePath, CancellationToken cancellationToken);

    Task<AppSummaryDto?> SetAppOrdinalAsync(Guid appId, int ordinal, Guid? environmentId, CancellationToken cancellationToken);

    Task<AppSummaryDto?> SetAppNameAsync(Guid appId, string name, Guid? environmentId, CancellationToken cancellationToken);

    Task<AppSummaryDto?> SetAppBoxAsync(Guid appId, Guid? boxId, Guid? environmentId, CancellationToken cancellationToken);

    Task<AppSummaryDto?> SetAppRegistrationAsync(Guid appId, SetAppRegistrationRequest request, Guid? environmentId, CancellationToken cancellationToken);

    Task<bool> DeleteAppRegistrationAsync(Guid appId, CancellationToken cancellationToken);

    Task<AppRegistrationDto?> SetAppRegistrationManifestAsync(Guid appId, string fileName, string contentType, byte[] content, CancellationToken cancellationToken);

    Task<AppRegistrationManifest?> GetAppRegistrationManifestAsync(Guid appId, CancellationToken cancellationToken);

    Task<SettingRowDto> CreateSettingAsync(Guid appId, CreateSettingRequest request, CancellationToken cancellationToken);

    Task<bool> DeleteSettingAsync(Guid settingId, CancellationToken cancellationToken);

    Task<SettingRowDto> SetSettingValueAsync(Guid settingId, Guid environmentId, SetSettingValueRequest request, CancellationToken cancellationToken);

    Task<string> RenderAsync(Guid appId, Guid environmentId, string? filePath, CancellationToken cancellationToken);

    Task<int> ImportAsync(Guid appId, ImportRequest request, CancellationToken cancellationToken);

    Task<DiffDto> DiffAsync(Guid appId, DiffRequest request, CancellationToken cancellationToken);
}
