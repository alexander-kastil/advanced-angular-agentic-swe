namespace SecretsMcp.Data.Entities;

public sealed class Category
{
    public Guid CategoryId { get; set; }
    public Guid ListId { get; set; }
    public string Topic { get; set; } = "";
    public string Color { get; set; } = "";
}
