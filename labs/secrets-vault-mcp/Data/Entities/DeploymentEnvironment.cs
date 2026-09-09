namespace SecretsMcp.Data.Entities;

public sealed class DeploymentEnvironment
{
    public Guid EnvironmentId { get; set; }
    public string Name { get; set; } = "";
    public string Type { get; set; } = "";
    public int Ordinal { get; set; }
}
