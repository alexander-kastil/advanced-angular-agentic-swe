using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;
using SecretsMcp.Services;

namespace SecretsMcp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "CustomerOrMachine")]
public class ProviderKeysController(
    IProviderKeyRepository repository,
    IProviderConnectivityTester connectivityTester,
    ILogger<ProviderKeysController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken = default) =>
        Ok(await repository.ListAsync(cancellationToken));

    [HttpPut("{provider}/{serviceKey}")]
    public async Task<IActionResult> Set(
        string provider,
        string serviceKey,
        SetProviderKeyRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return Ok(await repository.SetAsync(provider, serviceKey, request, cancellationToken));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("test/{provider}/{serviceKey}")]
    public async Task<IActionResult> Test(
        string provider,
        string serviceKey,
        CancellationToken cancellationToken = default)
    {
        var credential = await repository.ResolveDecryptedAsync(provider, serviceKey, cancellationToken);
        var baseUrl = await repository.ResolveBaseUrlAsync(provider, serviceKey, cancellationToken);

        if (string.IsNullOrEmpty(credential) || string.IsNullOrEmpty(baseUrl))
        {
            return Ok(new ProviderKeyConnectivityResult("failed"));
        }

        var reachable = await connectivityTester.TestAsync(provider, baseUrl, credential, cancellationToken);
        return Ok(new ProviderKeyConnectivityResult(reachable ? "ok" : "failed"));
    }

    [HttpPost("resolve/{provider}/{serviceKey}")]
    [Authorize(Policy = AuthorizationPolicies.MachineOnly)]
    public async Task<IActionResult> Resolve(
        string provider,
        string serviceKey,
        CancellationToken cancellationToken = default)
    {
        var pair = $"{provider}/{serviceKey}";
        var caller = User.Identity?.Name ?? "unknown";

        var granted = User.FindAll(McpApiKeyAuthHandler.GrantClaimType)
            .Any(claim => string.Equals(claim.Value, pair, StringComparison.OrdinalIgnoreCase));

        if (!granted)
        {
            logger.LogWarning("ProviderKeys resolve denied for {Caller} on {Pair}", caller, pair);
            return Forbid();
        }

        var value = await repository.ResolveDecryptedAsync(provider, serviceKey, cancellationToken);
        if (value is null)
        {
            return NotFound();
        }

        var baseUrl = await repository.ResolveBaseUrlAsync(provider, serviceKey, cancellationToken);

        logger.LogInformation("ProviderKeys resolve granted for {Caller} on {Pair}", caller, pair);
        return Ok(new ResolveProviderKeyResponse(value, baseUrl));
    }
}
