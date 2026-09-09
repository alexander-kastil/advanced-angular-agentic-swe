using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Data;

namespace SecretsMcp.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(
    IDbContextFactory<SecretsDbContext> contextFactory,
    LocalTokenService tokenService) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var user = await db.Users
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Name == request.Name, cancellationToken);

        if (user is null || !user.IsActive || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized();
        }

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        var (token, expiresAt) = tokenService.Issue(user.UserId, user.Name, roles);

        return Ok(new LoginResponse(token, expiresAt, user.Name, roles));
    }

    [HttpGet("me")]
    [Authorize(AuthenticationSchemes = LocalAuthDefaults.AuthenticationScheme)]
    public async Task<ActionResult<AuthMeResponse>> Me(CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst("sub")?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var user = await db.Users
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

        if (user is null || !user.IsActive)
        {
            return Unauthorized();
        }

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        var permissions = roles.Contains(AuthorizationPolicies.OwnerRole) ? new[] { "*" } : [];

        return Ok(new AuthMeResponse(user.Name, roles, permissions));
    }
}
