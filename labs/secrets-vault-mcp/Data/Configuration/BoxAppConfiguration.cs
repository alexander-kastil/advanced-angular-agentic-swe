using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class BoxAppConfiguration : IEntityTypeConfiguration<BoxApp>
{
    public void Configure(EntityTypeBuilder<BoxApp> builder)
    {
        builder.ToTable("BoxApps");

        builder.HasKey(e => e.BoxAppId).HasName("PK_BoxApps");

        builder.Property(e => e.BoxAppId);
        builder.Property(e => e.BoxId).IsRequired();
        builder.Property(e => e.Name).IsRequired();
        builder.Property(e => e.Container);
        builder.Property(e => e.Image);
        builder.Property(e => e.Slot);
        builder.Property(e => e.Hostnames);
        builder.Property(e => e.PublishedPort);
        builder.Property(e => e.EnvFile);
        builder.Property(e => e.Ordinal).IsRequired();

        builder.HasIndex(e => new { e.BoxId, e.Name })
            .IsUnique()
            .HasDatabaseName("UX_BoxApps_BoxId_Name");

        builder.HasOne(e => e.Box)
            .WithMany(b => b.Apps)
            .HasForeignKey(e => e.BoxId)
            .HasConstraintName("FK_BoxApps_Boxes_BoxId")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
