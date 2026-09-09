using System.ComponentModel;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using ModelContextProtocol.Server;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;
using SecretsMcp.Services;

namespace SecretsMcp.Tools;

[McpServerToolType]
[Authorize(Policy = AuthorizationPolicies.AgentProviderKeys)]
public sealed class ProviderKeyTools(
    IProviderKeyRepository repository,
    IProviderConnectivityTester connectivityTester,
    IHttpContextAccessor httpContextAccessor,
    ILogger<ProviderKeyTools> logger)
{
    [McpServerTool(Name = "list_provider_keys")]
    [Description("Lists the provider credentials in the store, the same rows the secrets-ui shows at /ai/models. Each row carries the provider, the service key, the display label, the base url, the last four characters of the credential, when it was last written and its version. The credential itself is never returned by this tool: read it with resolve_provider_key.")]
    public async Task<IReadOnlyList<ProviderKeyDto>> ListProviderKeys(
        CancellationToken cancellationToken = default) =>
        await repository.ListAsync(cancellationToken);

    [McpServerTool(Name = "set_provider_key")]
    [Description("Writes a provider credential, creating the provider and serviceKey pair when it does not exist and replacing the stored credential when it does. The credential is encrypted at rest and cannot be read back through this tool. Pass a label when creating a new row; omit it on an update to keep the current one.")]
    public async Task<ProviderKeyDto> SetProviderKey(
        [Description("The provider, for example deepinfra or deepseek, exactly as returned by list_provider_keys.")] string provider,
        [Description("The service key within that provider, for example api.")] string serviceKey,
        [Description("The credential itself. Written once and never read back through this tool.")] string key,
        [Description("The display label for this row, for example 'DeepSeek API Key'. Required when creating a new row; omit on an update to keep the current one.")] string? label = null,
        [Description("The provider's base url for this service key, or omit to keep the current one.")] string? baseUrl = null,
        CancellationToken cancellationToken = default) =>
        await repository.SetAsync(provider, serviceKey, new SetProviderKeyRequest(key, label, baseUrl), cancellationToken);

    [McpServerTool(Name = "test_provider_key")]
    [Description("Checks whether a stored provider credential still reaches its provider, by calling the provider with it. Returns ok when the provider answered and failed when it did not, or when no credential or base url is stored for the pair. The credential is never returned.")]
    public async Task<ProviderKeyConnectivityResult> TestProviderKey(
        [Description("The provider, exactly as returned by list_provider_keys.")] string provider,
        [Description("The service key within that provider, exactly as returned by list_provider_keys.")] string serviceKey,
        CancellationToken cancellationToken = default)
    {
        var credential = await repository.ResolveDecryptedAsync(provider, serviceKey, cancellationToken);
        var baseUrl = await repository.ResolveBaseUrlAsync(provider, serviceKey, cancellationToken);

        if (string.IsNullOrEmpty(credential) || string.IsNullOrEmpty(baseUrl))
        {
            return new ProviderKeyConnectivityResult("failed");
        }

        var reachable = await connectivityTester.TestAsync(provider, baseUrl, credential, cancellationToken);
        return new ProviderKeyConnectivityResult(reachable ? "ok" : "failed");
    }

    [McpServerTool(Name = "resolve_provider_key")]
    [Description("Returns the decrypted provider credential and its base url. This is the only tool that hands back a credential, and it requires the caller to hold a grant naming that exact provider and serviceKey pair, for example deepinfra/api. Holding the provider-keys grant alone is not enough. Returns null when the pair does not exist or the caller does not hold its grant.")]
    public async Task<ResolveProviderKeyResponse?> ResolveProviderKey(
        [Description("The provider, exactly as returned by list_provider_keys.")] string provider,
        [Description("The service key within that provider, exactly as returned by list_provider_keys.")] string serviceKey,
        CancellationToken cancellationToken = default)
    {
        var pair = $"{provider}/{serviceKey}";
        var user = httpContextAccessor.HttpContext?.User ?? new ClaimsPrincipal();
        var caller = user.Identity?.Name ?? "unknown";

        var granted = user.FindAll(McpApiKeyAuthHandler.GrantClaimType)
            .Any(claim => string.Equals(claim.Value, pair, StringComparison.OrdinalIgnoreCase));

        if (!granted)
        {
            logger.LogWarning("ProviderKeys resolve denied for {Caller} on {Pair}", caller, pair);
            return null;
        }

        var value = await repository.ResolveDecryptedAsync(provider, serviceKey, cancellationToken);
        if (value is null)
        {
            return null;
        }

        var baseUrl = await repository.ResolveBaseUrlAsync(provider, serviceKey, cancellationToken);

        logger.LogInformation("ProviderKeys resolve granted for {Caller} on {Pair}", caller, pair);
        return new ResolveProviderKeyResponse(value, baseUrl);
    }
}
