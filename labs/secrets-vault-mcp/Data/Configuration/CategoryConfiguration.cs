using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");

        builder.HasKey(e => e.CategoryId).HasName("PK_Categories");

        builder.Property(e => e.CategoryId);
        builder.Property(e => e.ListId).IsRequired();
        builder.Property(e => e.Topic).IsRequired();
        builder.Property(e => e.Color).IsRequired();

        builder.HasIndex(e => new { e.ListId, e.Topic })
            .IsUnique()
            .HasDatabaseName("UX_Categories_ListId_Topic");

        builder.HasOne<SecretList>()
            .WithMany()
            .HasForeignKey(e => e.ListId)
            .HasConstraintName("FK_Categories_SecretLists_ListId");
    }
}
