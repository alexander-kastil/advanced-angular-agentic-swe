namespace SecretsMcp.Data.Entities;

public sealed class BoxCredential
{
    public Guid CredentialId { get; set; }
    public Guid BoxId { get; set; }
    public string Kind { get; set; } = BoxCredentialKind.SshKey;
    public string Label { get; set; } = "";
    public string? Username { get; set; }
    public string? Value { get; set; }
    public string? KeyPath { get; set; }
    public string? Fingerprint { get; set; }
    public string? Comment { get; set; }
    public int Ordinal { get; set; }
    public DateTime LastChanged { get; set; }
    public Box Box { get; set; } = null!;
}
