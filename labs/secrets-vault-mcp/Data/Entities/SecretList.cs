namespace SecretsMcp.Data.Entities;

public sealed class SecretList
{
    public Guid ListId { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public SecretListType Type { get; set; }
}
