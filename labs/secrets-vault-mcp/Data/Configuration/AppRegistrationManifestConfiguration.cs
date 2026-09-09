using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class AppRegistrationManifestConfiguration : IEntityTypeConfiguration<AppRegistrationManifest>
{
    public void Configure(EntityTypeBuilder<AppRegistrationManifest> builder)
    {
        builder.ToTable("AppRegistrationManifests");

        builder.HasKey(e => e.AppId).HasName("PK_AppRegistrationManifests");

        builder.Property(e => e.AppId);
        builder.Property(e => e.FileName).IsRequired();
        builder.Property(e => e.ContentType).IsRequired();
        builder.Property(e => e.ByteSize).IsRequired();
        builder.Property(e => e.Content).IsRequired();
        builder.Property(e => e.UploadedAt).IsRequired();

        builder.HasOne<AppRegistration>()
            .WithOne()
            .HasForeignKey<AppRegistrationManifest>(e => e.AppId)
            .HasConstraintName("FK_AppRegistrationManifests_AppRegistrations_AppId")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
