using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class AppTargetConfiguration : IEntityTypeConfiguration<AppTarget>
{
    public void Configure(EntityTypeBuilder<AppTarget> builder)
    {
        builder.ToTable("AppTargets");

        builder.HasKey(e => e.TargetId).HasName("PK_AppTargets");

        builder.Property(e => e.TargetId);
        builder.Property(e => e.AppId).IsRequired();
        builder.Property(e => e.EnvironmentId).IsRequired();
        builder.Property(e => e.FilePath).IsRequired();
        builder.Property(e => e.Ordinal).IsRequired();

        builder.HasIndex(e => new { e.AppId, e.EnvironmentId, e.FilePath })
            .IsUnique()
            .HasDatabaseName("UX_AppTargets_AppId_EnvironmentId_FilePath");

        builder.HasOne(e => e.App)
            .WithMany(a => a.Targets)
            .HasForeignKey(e => e.AppId)
            .HasConstraintName("FK_AppTargets_Apps_AppId")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Environment)
            .WithMany()
            .HasForeignKey(e => e.EnvironmentId)
            .HasConstraintName("FK_AppTargets_Environments_EnvironmentId")
            .OnDelete(DeleteBehavior.Restrict);
    }
}
