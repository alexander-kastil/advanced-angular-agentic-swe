using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class RepoConfiguration : IEntityTypeConfiguration<Repo>
{
    public void Configure(EntityTypeBuilder<Repo> builder)
    {
        builder.ToTable("Repos");

        builder.HasKey(e => e.RepoId).HasName("PK_Repos");

        builder.Property(e => e.RepoId);
        builder.Property(e => e.Name).IsRequired();
        builder.Property(e => e.LocalPath);
        builder.Property(e => e.RemoteUrl);
        builder.Property(e => e.LastChanged).IsRequired();
    }
}
