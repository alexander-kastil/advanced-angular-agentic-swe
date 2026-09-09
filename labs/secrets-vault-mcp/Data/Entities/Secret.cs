using SecretsMcp.Data.Encryption;

namespace SecretsMcp.Data.Entities;

public sealed class Secret
{
    public Guid SecretId { get; set; }
    public Guid ListId { get; set; }
    public string Name { get; set; } = "";
    public string? Url { get; set; }
    public string? User { get; set; }
    [DbEncrypted(500)]
    public string? Password { get; set; }
    public byte[]? PasswordCipher { get; private set; }
    public string? Comment { get; set; }
    public bool Mfa { get; set; }
    public int Version { get; set; }
    public DateTime LastChanged { get; set; }
    public ICollection<SecretCategory> SecretCategories { get; set; } = new List<SecretCategory>();
}
