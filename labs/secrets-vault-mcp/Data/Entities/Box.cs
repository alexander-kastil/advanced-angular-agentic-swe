namespace SecretsMcp.Data.Entities;

public sealed class Box
{
    public Guid BoxId { get; set; }
    public string Name { get; set; } = "";
    public string Provider { get; set; } = "hetzner-cloud";
    public long? ServerId { get; set; }
    public string? Ipv4 { get; set; }
    public string? Ipv6 { get; set; }
    public string? ServerType { get; set; }
    public string? Location { get; set; }
    public string? Hostname { get; set; }
    public string? Role { get; set; }
    public string? SshUser { get; set; }
    public string? SshKeyPath { get; set; }
    public string? SshKeyName { get; set; }
    public string? StackDir { get; set; }
    public string? EdgeDir { get; set; }
    public string? EdgeContainer { get; set; }
    public string? DockerNetwork { get; set; }
    public string? PortBand { get; set; }
    public string? ComposePath { get; set; }
    public string? EnvDir { get; set; }
    public string? Notes { get; set; }
    public int Ordinal { get; set; }
    public DateTime LastChanged { get; set; }
    public ICollection<BoxCredential> Credentials { get; set; } = [];
    public ICollection<BoxApp> Apps { get; set; } = [];
}
