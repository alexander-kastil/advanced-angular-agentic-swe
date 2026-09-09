namespace SecretsMcp.Data.Entities;

public sealed class BoxApp
{
    public Guid BoxAppId { get; set; }
    public Guid BoxId { get; set; }
    public string Name { get; set; } = "";
    public string? Container { get; set; }
    public string? Image { get; set; }
    public string? Slot { get; set; }
    public string? Hostnames { get; set; }
    public int? PublishedPort { get; set; }
    public string? EnvFile { get; set; }
    public int Ordinal { get; set; }
    public Box Box { get; set; } = null!;
}
