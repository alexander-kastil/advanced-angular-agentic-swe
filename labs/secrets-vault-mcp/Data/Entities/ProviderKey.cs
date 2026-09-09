namespace SecretsMcp.Data.Entities;

public sealed class ProviderKey
{
    public string Provider { get; set; } = "";
    public string ServiceKey { get; set; } = "";
    public string Label { get; set; } = "";
    public string? Value { get; set; }
    public string? BaseUrl { get; set; }
    public int Version { get; set; }
    public DateTime UpdatedAt { get; set; }
}
