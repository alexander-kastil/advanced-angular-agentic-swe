using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class SettingConfiguration : IEntityTypeConfiguration<Setting>
{
    public void Configure(EntityTypeBuilder<Setting> builder)
    {
        builder.ToTable("Settings");

        builder.HasKey(e => e.SettingId).HasName("PK_Settings");

        builder.Property(e => e.SettingId);
        builder.Property(e => e.AppId).IsRequired();
        builder.Property(e => e.Name).IsRequired();
        builder.Property(e => e.IsSecret).IsRequired();
        builder.Property(e => e.Comment);
        builder.Property(e => e.Ordinal).IsRequired();
        builder.Property(e => e.LastChanged).IsRequired();

        builder.HasIndex(e => new { e.AppId, e.Name })
            .IsUnique()
            .HasDatabaseName("UX_Settings_AppId_Name");

        builder.HasOne(e => e.App)
            .WithMany(a => a.Settings)
            .HasForeignKey(e => e.AppId)
            .HasConstraintName("FK_Settings_Apps_AppId")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
