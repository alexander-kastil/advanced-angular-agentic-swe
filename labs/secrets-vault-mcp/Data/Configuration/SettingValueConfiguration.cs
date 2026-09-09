using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class SettingValueConfiguration : IEntityTypeConfiguration<SettingValue>
{
    public void Configure(EntityTypeBuilder<SettingValue> builder)
    {
        builder.ToTable("SettingValues");

        builder.HasKey(e => new { e.SettingId, e.EnvironmentId }).HasName("PK_SettingValues");

        builder.Property(e => e.SettingId);
        builder.Property(e => e.EnvironmentId);
        builder.Property(e => e.TargetId);
        builder.Property(e => e.KeyPath).IsRequired();
        builder.Property(e => e.Value);
        builder.Property(e => e.IsPlaceholder).IsRequired();
        builder.Property(e => e.SecretListId);
        builder.Property(e => e.SecretName);
        builder.Property(e => e.LastChanged).IsRequired();

        builder.HasOne(e => e.Setting)
            .WithMany(s => s.Values)
            .HasForeignKey(e => e.SettingId)
            .HasConstraintName("FK_SettingValues_Settings_SettingId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Environment)
            .WithMany()
            .HasForeignKey(e => e.EnvironmentId)
            .HasConstraintName("FK_SettingValues_Environments_EnvironmentId")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Target)
            .WithMany()
            .HasForeignKey(e => e.TargetId)
            .HasConstraintName("FK_SettingValues_AppTargets_TargetId")
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne<SecretList>()
            .WithMany()
            .HasForeignKey(e => e.SecretListId)
            .HasConstraintName("FK_SettingValues_SecretLists_SecretListId")
            .OnDelete(DeleteBehavior.Restrict);
    }
}
