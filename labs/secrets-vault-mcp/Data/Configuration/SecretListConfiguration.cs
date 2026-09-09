using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class SecretListConfiguration : IEntityTypeConfiguration<SecretList>
{
    public void Configure(EntityTypeBuilder<SecretList> builder)
    {
        builder.ToTable("SecretLists");

        builder.HasKey(e => e.ListId).HasName("PK_SecretLists");

        builder.Property(e => e.ListId);
        builder.Property(e => e.Name).IsRequired();
        builder.Property(e => e.Description);
        builder.Property(e => e.Type).HasConversion<int>().IsRequired();

        builder.HasIndex(e => e.Name)
            .IsUnique()
            .HasDatabaseName("UX_SecretLists_Name");
    }
}
