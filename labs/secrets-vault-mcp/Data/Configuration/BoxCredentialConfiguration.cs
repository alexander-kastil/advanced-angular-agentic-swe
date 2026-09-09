using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class BoxCredentialConfiguration : IEntityTypeConfiguration<BoxCredential>
{
    public void Configure(EntityTypeBuilder<BoxCredential> builder)
    {
        builder.ToTable("BoxCredentials");

        builder.HasKey(e => e.CredentialId).HasName("PK_BoxCredentials");

        builder.Property(e => e.CredentialId);
        builder.Property(e => e.BoxId).IsRequired();
        builder.Property(e => e.Kind).IsRequired();
        builder.Property(e => e.Label).IsRequired();
        builder.Property(e => e.Username);
        builder.Property(e => e.Value);
        builder.Property(e => e.KeyPath);
        builder.Property(e => e.Fingerprint);
        builder.Property(e => e.Comment);
        builder.Property(e => e.Ordinal).IsRequired();
        builder.Property(e => e.LastChanged).IsRequired();

        builder.HasIndex(e => new { e.BoxId, e.Label })
            .IsUnique()
            .HasDatabaseName("UX_BoxCredentials_BoxId_Label");

        builder.HasOne(e => e.Box)
            .WithMany(b => b.Credentials)
            .HasForeignKey(e => e.BoxId)
            .HasConstraintName("FK_BoxCredentials_Boxes_BoxId")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
