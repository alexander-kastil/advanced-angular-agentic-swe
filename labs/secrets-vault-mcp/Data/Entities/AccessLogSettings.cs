namespace SecretsMcp.Data.Entities;

public sealed class AccessLogSettings
{
    public const string SingletonId = "singleton";

    public string Id { get; set; } = SingletonId;
    public bool RecordCodingAgentOnly { get; set; } = true;
    public DateTime LastChanged { get; set; }
}
