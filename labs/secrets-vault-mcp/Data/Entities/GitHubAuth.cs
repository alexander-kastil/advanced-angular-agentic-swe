using SecretsMcp.Data.Encryption;

namespace SecretsMcp.Data.Entities;

public sealed class GitHubAuth
{
    public const string SingletonId = "singleton";

    public string Id { get; set; } = SingletonId;
    [DbEncrypted(1024)]
    public string? Token { get; set; }
    public byte[]? TokenCipher { get; private set; }
    public string? Login { get; set; }
    public DateTime UpdatedUtc { get; set; }
}
