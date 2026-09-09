namespace SecretsMcp.Config;

public class AppConfig
{
    public AuthConfig Auth { get; set; } = new();
    public CorsConfig Cors { get; set; } = new();
    public VaultConfig Vault { get; set; } = new();
    public string DbEncryptionKey { get; set; } = string.Empty;
}

public class VaultConfig
{
    public int MaxFileVersions { get; set; } = 3;
}

public class AuthConfig
{
    public bool Enabled { get; set; }
    public LocalJwtConfig LocalJwt { get; set; } = new();
}

public class LocalJwtConfig
{
    public string Issuer { get; set; } = "secrets-vault-mcp-api";
    public string Audience { get; set; } = "secrets-vault-mcp-ui";
    public string SigningKey { get; set; } = string.Empty;
    public int LifetimeHours { get; set; } = 12;
}

public class CorsConfig
{
    public static readonly string[] DefaultAllowedOrigins =
        ["http://localhost:4502", "https://store.integrations.at", "https://next.store.integrations.at"];

    public string[] AllowedOrigins { get; set; } = [];
}
