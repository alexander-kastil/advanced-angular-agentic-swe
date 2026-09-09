using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class ModelConfiguration : IEntityTypeConfiguration<Model>
{
    public void Configure(EntityTypeBuilder<Model> builder)
    {
        builder.ToTable("Models");

        builder.HasKey(e => new { e.Provider, e.ModelName }).HasName("PK_Models");

        builder.Property(e => e.Provider).IsRequired();
        builder.Property(e => e.ModelName).IsRequired();
        builder.Property(e => e.Name).IsRequired();
        builder.Property(e => e.SupportsVision).IsRequired();
        builder.Property(e => e.Temperature).IsRequired().HasDefaultValue(0.2m);
        builder.Property(e => e.MaxTokens);
        builder.Property(e => e.TopP);
        builder.Property(e => e.IsDefault).IsRequired().HasDefaultValue(false);
        builder.Property(e => e.Icon);
        builder.Property(e => e.IconContentType);
        builder.Property(e => e.Description);
        builder.Property(e => e.TaskType);
        builder.Property(e => e.ContextLength);
        builder.Property(e => e.Quantization);
        builder.Property(e => e.ServingTier);
        builder.Property(e => e.PriceCachedInPerMillion);
        builder.Property(e => e.PriceInPerMillion);
        builder.Property(e => e.PriceOutPerMillion);
        builder.Property(e => e.PricePerUnit);
        builder.Property(e => e.PriceUnit);
    }
}
