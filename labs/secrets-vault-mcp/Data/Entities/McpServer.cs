using SecretsMcp.Data.Encryption;

namespace SecretsMcp.Data.Entities;

public sealed class McpServer
{
    public Guid McpServerId { get; set; }
    public string Name { get; set; } = "";
    public string Label { get; set; } = "";
    public string Transport { get; set; } = "";
    public string? Url { get; set; }
    public string? Command { get; set; }
    public string? Args { get; set; }
    public string? HeaderName { get; set; }
    [DbEncrypted(500)]
    public string? ApiKey { get; set; }
    public byte[]? ApiKeyCipher { get; private set; }
    public string? Description { get; set; }
    public byte[]? Icon { get; set; }
    public string? IconContentType { get; set; }
    public int Ordinal { get; set; }
    public DateTime UpdatedAt { get; set; }
}
