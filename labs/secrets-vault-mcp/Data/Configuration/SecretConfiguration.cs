using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class SecretConfiguration : IEntityTypeConfiguration<Secret>
{
    public void Configure(EntityTypeBuilder<Secret> builder)
    {
        builder.ToTable("Secrets");

        builder.HasKey(e => e.SecretId).HasName("PK_Secrets");

        builder.Property(e => e.SecretId);
        builder.Property(e => e.ListId).IsRequired();
        builder.Property(e => e.Name).IsRequired();
        builder.Property(e => e.Url);
        builder.Property(e => e.User).HasColumnName("User");
        builder.Property(e => e.Comment);
        builder.Property(e => e.Mfa).IsRequired();
        builder.Property(e => e.Version).IsRequired();
        builder.Property(e => e.LastChanged).IsRequired();

        builder.HasIndex(e => new { e.ListId, e.Name, e.Version })
            .IsUnique()
            .HasDatabaseName("UX_Secrets_ListId_Name_Version");

        builder.HasOne<SecretList>()
            .WithMany()
            .HasForeignKey(e => e.ListId)
            .HasConstraintName("FK_Secrets_SecretLists_ListId");
    }
}
