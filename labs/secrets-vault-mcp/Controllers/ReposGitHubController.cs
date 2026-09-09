using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;
using SecretsMcp.Services;

namespace SecretsMcp.Controllers;

[ApiController]
[Route("api/repos/github")]
[Authorize(Policy = AuthorizationPolicies.AgentRepos)]
public class ReposGitHubController(
    IGitHubOAuthService oauth,
    IGitHubAuthRepository store) : ControllerBase
{
    [HttpGet("status")]
    public async Task<IActionResult> Status(CancellationToken cancellationToken)
    {
        var (connected, login) = await store.GetStatusAsync(cancellationToken);
        return Ok(new GitHubStatusDto(oauth.IsConfigured, connected, login));
    }

    [HttpPost("device/start")]
    public async Task<IActionResult> DeviceStart(CancellationToken cancellationToken)
    {
        if (!oauth.IsConfigured)
            return BadRequest("GitHub is not configured. Set GitHub:ClientId in appsettings.json.");

        var start = await oauth.StartDeviceAsync(cancellationToken);
        if (start is null)
            return StatusCode(502, "GitHub did not return a device code.");

        return Ok(new DeviceStartDto(start.DeviceCode, start.UserCode, start.VerificationUri, start.ExpiresIn, start.Interval));
    }

    [HttpPost("device/poll")]
    public async Task<IActionResult> DevicePoll(DevicePollRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.DeviceCode))
            return Ok(new DevicePollDto("expired", null, 0));

        var poll = await oauth.PollTokenAsync(request.DeviceCode, cancellationToken);

        if (string.IsNullOrWhiteSpace(poll.Token))
        {
            var status = poll.Error switch
            {
                "authorization_pending" => "pending",
                "slow_down" => "slow_down",
                "access_denied" => "denied",
                _ => "expired",
            };
            return Ok(new DevicePollDto(status, null, poll.Interval));
        }

        var login = await oauth.FetchLoginAsync(poll.Token, cancellationToken);
        await store.SaveAsync(poll.Token, login, cancellationToken);

        return Ok(new DevicePollDto("connected", login, 0));
    }

    [HttpGet("available")]
    public async Task<IActionResult> Available(CancellationToken cancellationToken)
    {
        var token = await store.GetTokenAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(token))
            return Ok(Array.Empty<GitHubRepoDto>());

        var repos = await oauth.ListReposAsync(token, cancellationToken);
        return Ok(repos);
    }

    [HttpPost("disconnect")]
    public async Task<IActionResult> Disconnect(CancellationToken cancellationToken)
    {
        await store.ClearAsync(cancellationToken);
        return NoContent();
    }
}
