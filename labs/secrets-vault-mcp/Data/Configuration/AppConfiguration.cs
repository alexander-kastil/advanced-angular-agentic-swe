using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class AppConfiguration : IEntityTypeConfiguration<App>
{
    public void Configure(EntityTypeBuilder<App> builder)
    {
        builder.ToTable("Apps");

        builder.HasKey(e => e.AppId).HasName("PK_Apps");

        builder.Property(e => e.AppId);
        builder.Property(e => e.RepoId).IsRequired();
        builder.Property(e => e.Name).IsRequired();
        builder.Property(e => e.Kind).IsRequired();
        builder.Property(e => e.BoxId);
        builder.Property(e => e.Ordinal).IsRequired();
        builder.Property(e => e.LastChanged).IsRequired();

        builder.HasIndex(e => new { e.RepoId, e.Name })
            .IsUnique()
            .HasDatabaseName("UX_Apps_RepoId_Name");

        builder.HasIndex(e => e.BoxId)
            .HasDatabaseName("IX_Apps_BoxId");

        builder.HasOne(e => e.Repo)
            .WithMany(r => r.Apps)
            .HasForeignKey(e => e.RepoId)
            .HasConstraintName("FK_Apps_Repos_RepoId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Box)
            .WithMany()
            .HasForeignKey(e => e.BoxId)
            .HasConstraintName("FK_Apps_Boxes_BoxId")
            .OnDelete(DeleteBehavior.SetNull);
    }
}
