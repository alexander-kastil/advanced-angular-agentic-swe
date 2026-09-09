namespace SecretsMcp.Data.Entities;

public sealed class Model
{
    public string Provider { get; set; } = "";
    public string ModelName { get; set; } = "";
    public string Name { get; set; } = "";
    public bool SupportsVision { get; set; }
    public decimal Temperature { get; set; } = 0.2m;
    public int? MaxTokens { get; set; }
    public decimal? TopP { get; set; }
    public bool IsDefault { get; set; }
    public byte[]? Icon { get; set; }
    public string? IconContentType { get; set; }
    public string? Description { get; set; }
    public string? TaskType { get; set; }
    public int? ContextLength { get; set; }
    public string? Quantization { get; set; }
    public string? ServingTier { get; set; }
    public decimal? PriceCachedInPerMillion { get; set; }
    public decimal? PriceInPerMillion { get; set; }
    public decimal? PriceOutPerMillion { get; set; }
    public decimal? PricePerUnit { get; set; }
    public string? PriceUnit { get; set; }
}
