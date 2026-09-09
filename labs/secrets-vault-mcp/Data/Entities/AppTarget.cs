namespace SecretsMcp.Data.Entities;

public sealed class AppTarget
{
    public Guid TargetId { get; set; }
    public Guid AppId { get; set; }
    public Guid EnvironmentId { get; set; }
    public string FilePath { get; set; } = "";
    public int Ordinal { get; set; }
    public App App { get; set; } = null!;
    public DeploymentEnvironment Environment { get; set; } = null!;
}
