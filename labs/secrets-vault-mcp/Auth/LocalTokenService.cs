using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SecretsMcp.Config;

namespace SecretsMcp.Auth;

public sealed class LocalTokenService(AppConfig config)
{
    public (string Token, DateTimeOffset ExpiresAt) Issue(Guid userId, string name, IEnumerable<string> roles)
    {
        var localJwt = config.Auth.LocalJwt;
        var expiresAt = DateTimeOffset.UtcNow.AddHours(localJwt.LifetimeHours);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new("name", name)
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim("role", role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(localJwt.SigningKey));
        var token = new JwtSecurityToken(
            issuer: localJwt.Issuer,
            audience: localJwt.Audience,
            claims: claims,
            expires: expiresAt.UtcDateTime,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }
}
