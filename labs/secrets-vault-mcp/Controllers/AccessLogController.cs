using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;
using SecretsMcp.Services;

namespace SecretsMcp.Controllers;

[ApiController]
[Route("api/access-log")]
[Authorize(Policy = AuthorizationPolicies.Owner)]
public class AccessLogController(
    IAccessLogRepository repository,
    IAccessLogSettingsRepository settingsRepository,
    IAccessLogSettingsCache settingsCache) : ControllerBase
{
    private const int DefaultTake = 200;
    private const int MaxTake = 500;

    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings(CancellationToken cancellationToken = default) =>
        Ok(new AccessLogSettingsDto(await settingsRepository.GetRecordCodingAgentOnlyAsync(cancellationToken)));

    [HttpPut("settings")]
    public async Task<IActionResult> UpdateSettings(
        UpdateAccessLogSettingsRequest request,
        CancellationToken cancellationToken = default)
    {
        await settingsRepository.SetRecordCodingAgentOnlyAsync(request.RecordCodingAgentOnly, cancellationToken);
        settingsCache.Invalidate();
        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int skip = 0,
        [FromQuery] int take = DefaultTake,
        [FromQuery] string? action = null,
        [FromQuery] string? entityType = null,
        [FromQuery] string? userName = null,
        CancellationToken cancellationToken = default) =>
        Ok(await repository.ListAsync(skip, Math.Clamp(take, 1, MaxTake), action, entityType, userName, cancellationToken));
}
