namespace SecretsMcp.Data.Entities;

public sealed class SecretCategory
{
    public Guid SecretId { get; set; }
    public Guid CategoryId { get; set; }
    public Secret Secret { get; set; } = null!;
    public Category Category { get; set; } = null!;
}
