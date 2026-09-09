using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace SecretsMcp.Auth;

public sealed class McpApiKeyAuthHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder,
    IConfiguration configuration)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    public const string SchemeName = "ApiKey";
    public const string HeaderName = "X-API-Key";

    private const string ConfigurationKey = "Mcp:ApiKeys";

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var entries = configuration.GetSection(ConfigurationKey).Get<McpApiKeyEntry[]>() ?? [];
        if (entries.Length == 0)
        {
            return Task.FromResult(AuthenticateResult.Fail($"{ConfigurationKey} is not configured."));
        }

        if (!Request.Headers.TryGetValue(HeaderName, out var provided) || string.IsNullOrEmpty(provided))
        {
            return Task.FromResult(AuthenticateResult.Fail($"Missing {HeaderName} header."));
        }

        var presented = provided.ToString();
        var matched = entries.FirstOrDefault(entry => FixedTimeEquals(presented, entry.Key));
        if (matched is null)
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid API key."));
        }

        Claim[] claims =
        [
            new Claim(ClaimTypes.Name, matched.Name),
            .. matched.Grants.Select(grant => new Claim(GrantClaimType, grant))
        ];

        var identity = new ClaimsIdentity(claims, SchemeName);
        var ticket = new AuthenticationTicket(new ClaimsPrincipal(identity), SchemeName);
        return Task.FromResult(AuthenticateResult.Success(ticket));
    }

    public const string GrantClaimType = "grant";

    private static bool FixedTimeEquals(string presented, string configured) =>
        CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(presented),
            Encoding.UTF8.GetBytes(configured));

    private sealed class McpApiKeyEntry
    {
        public string Name { get; init; } = "";
        public string Key { get; init; } = "";
        public string[] Grants { get; init; } = [];
    }
}
