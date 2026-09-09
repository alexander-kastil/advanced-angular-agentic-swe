using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class DeploymentEnvironmentConfiguration : IEntityTypeConfiguration<DeploymentEnvironment>
{
    public void Configure(EntityTypeBuilder<DeploymentEnvironment> builder)
    {
        builder.ToTable("Environments", t =>
            t.HasCheckConstraint("CK_Environments_Type", "[Type] = 'dev' OR [Type] = 'blue' OR [Type] = 'green'"));

        builder.HasKey(e => e.EnvironmentId).HasName("PK_Environments");

        builder.Property(e => e.EnvironmentId);
        builder.Property(e => e.Name).IsRequired();
        builder.Property(e => e.Type).IsRequired();
        builder.Property(e => e.Ordinal).IsRequired();

        builder.HasIndex(e => e.Name).IsUnique().HasDatabaseName("UX_Environments_Name");
        builder.HasIndex(e => e.Type).IsUnique().HasDatabaseName("UX_Environments_Type");
    }
}
