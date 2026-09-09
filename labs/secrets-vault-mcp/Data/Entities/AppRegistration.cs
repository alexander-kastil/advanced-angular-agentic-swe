namespace SecretsMcp.Data.Entities;

public sealed class AppRegistration
{
    public Guid AppId { get; set; }
    public string DisplayName { get; set; } = "";
    public Guid? ClientId { get; set; }
    public Guid? TenantId { get; set; }
    public Guid? ObjectId { get; set; }
    public string? SignInAudience { get; set; }
    public string? Notes { get; set; }
    public DateTime LastChanged { get; set; }
    public App App { get; set; } = null!;
}
