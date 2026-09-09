namespace SecretsMcp.Data.Entities;

public sealed class SettingValue
{
    public Guid SettingId { get; set; }
    public Guid EnvironmentId { get; set; }
    public Guid? TargetId { get; set; }
    public string KeyPath { get; set; } = "";
    public string? Value { get; set; }
    public bool IsPlaceholder { get; set; }
    public Guid? SecretListId { get; set; }
    public string? SecretName { get; set; }
    public DateTime LastChanged { get; set; }
    public Setting Setting { get; set; } = null!;
    public DeploymentEnvironment Environment { get; set; } = null!;
    public AppTarget? Target { get; set; }
}
