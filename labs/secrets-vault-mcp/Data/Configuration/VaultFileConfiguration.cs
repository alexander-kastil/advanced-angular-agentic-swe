using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class VaultFileConfiguration : IEntityTypeConfiguration<VaultFile>
{
    public void Configure(EntityTypeBuilder<VaultFile> builder)
    {
        builder.ToTable("VaultFiles");

        builder.HasKey(e => e.SecretId).HasName("PK_VaultFiles");

        builder.Property(e => e.SecretId);
        builder.Property(e => e.FileName).IsRequired();
        builder.Property(e => e.ContentType).IsRequired();
        builder.Property(e => e.ByteSize).IsRequired();
        builder.Property(e => e.Content).IsRequired();
        builder.Property(e => e.UploadedAt).IsRequired();

        builder.HasOne<Secret>()
            .WithOne()
            .HasForeignKey<VaultFile>(e => e.SecretId)
            .HasConstraintName("FK_VaultFiles_Secrets_SecretId")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
