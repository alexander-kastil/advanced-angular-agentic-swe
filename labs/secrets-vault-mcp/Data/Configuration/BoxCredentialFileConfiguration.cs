using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class BoxCredentialFileConfiguration : IEntityTypeConfiguration<BoxCredentialFile>
{
    public void Configure(EntityTypeBuilder<BoxCredentialFile> builder)
    {
        builder.ToTable("BoxCredentialFiles");

        builder.HasKey(e => e.CredentialId).HasName("PK_BoxCredentialFiles");

        builder.Property(e => e.CredentialId);
        builder.Property(e => e.FileName).IsRequired();
        builder.Property(e => e.ContentType).IsRequired();
        builder.Property(e => e.ByteSize).IsRequired();
        builder.Property(e => e.Content).IsRequired();
        builder.Property(e => e.UploadedAt).IsRequired();

        builder.HasOne<BoxCredential>()
            .WithOne()
            .HasForeignKey<BoxCredentialFile>(e => e.CredentialId)
            .HasConstraintName("FK_BoxCredentialFiles_BoxCredentials_CredentialId")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
