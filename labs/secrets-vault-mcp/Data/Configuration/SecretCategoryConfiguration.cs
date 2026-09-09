using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class SecretCategoryConfiguration : IEntityTypeConfiguration<SecretCategory>
{
    public void Configure(EntityTypeBuilder<SecretCategory> builder)
    {
        builder.ToTable("SecretCategories");

        builder.HasKey(e => new { e.SecretId, e.CategoryId }).HasName("PK_SecretCategories");

        builder.Property(e => e.SecretId);
        builder.Property(e => e.CategoryId);

        builder.HasOne(e => e.Secret)
            .WithMany(s => s.SecretCategories)
            .HasForeignKey(e => e.SecretId)
            .HasConstraintName("FK_SecretCategories_Secrets_SecretId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Category)
            .WithMany()
            .HasForeignKey(e => e.CategoryId)
            .HasConstraintName("FK_SecretCategories_Categories_CategoryId");
    }
}
