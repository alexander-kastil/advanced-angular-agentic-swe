using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class GitHubAuthConfiguration : IEntityTypeConfiguration<GitHubAuth>
{
    public void Configure(EntityTypeBuilder<GitHubAuth> builder)
    {
        builder.ToTable("GitHubAuth");

        builder.HasKey(e => e.Id).HasName("PK_GitHubAuth");

        builder.Property(e => e.Id);
        builder.Property(e => e.Login);
        builder.Property(e => e.UpdatedUtc).IsRequired();
    }
}
