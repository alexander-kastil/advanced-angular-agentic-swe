using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class ProviderKeyConfiguration : IEntityTypeConfiguration<ProviderKey>
{
    public void Configure(EntityTypeBuilder<ProviderKey> builder)
    {
        builder.ToTable("ProviderKeys");

        builder.HasKey(e => new { e.Provider, e.ServiceKey }).HasName("PK_ProviderKeys");

        builder.Property(e => e.Provider).IsRequired();
        builder.Property(e => e.ServiceKey).IsRequired();
        builder.Property(e => e.Label).IsRequired();
        builder.Property(e => e.BaseUrl);
        builder.Property(e => e.Version).IsRequired();
        builder.Property(e => e.UpdatedAt).IsRequired();
    }
}
