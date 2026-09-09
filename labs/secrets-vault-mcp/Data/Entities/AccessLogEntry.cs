namespace SecretsMcp.Data.Entities;

public sealed class AccessLogEntry
{
    public Guid AccessLogId { get; set; }
    public DateTime OccurredAt { get; set; }
    public string Action { get; set; } = "";
    public string EntityType { get; set; } = "";
    public string? EntityName { get; set; }
    public Guid? EntityId { get; set; }
    public string UserName { get; set; } = "";
    public string IpAddress { get; set; } = "";
    public string? Details { get; set; }
}
