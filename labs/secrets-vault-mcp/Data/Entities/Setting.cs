namespace SecretsMcp.Data.Entities;

public sealed class Setting
{
    public Guid SettingId { get; set; }
    public Guid AppId { get; set; }
    public string Name { get; set; } = "";
    public bool IsSecret { get; set; }
    public string? Comment { get; set; }
    public int Ordinal { get; set; }
    public DateTime LastChanged { get; set; }
    public App App { get; set; } = null!;
    public ICollection<SettingValue> Values { get; set; } = [];
}
