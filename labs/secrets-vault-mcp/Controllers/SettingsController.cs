using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;

namespace SecretsMcp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthorizationPolicies.AgentSettings)]
public class SettingsController(IAppRepository repository) : ControllerBase
{
    [HttpPut("values/{settingId:guid}/{environmentId:guid}")]
    public async Task<IActionResult> SetValue(
        Guid settingId,
        Guid environmentId,
        SetSettingValueRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return Ok(await repository.SetSettingValueAsync(settingId, environmentId, request, cancellationToken));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{settingId:guid}")]
    public async Task<IActionResult> Delete(
        Guid settingId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return await repository.DeleteSettingAsync(settingId, cancellationToken)
                ? NoContent()
                : NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
