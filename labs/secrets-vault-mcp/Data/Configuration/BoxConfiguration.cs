using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class BoxConfiguration : IEntityTypeConfiguration<Box>
{
    public void Configure(EntityTypeBuilder<Box> builder)
    {
        builder.ToTable("Boxes");

        builder.HasKey(e => e.BoxId).HasName("PK_Boxes");

        builder.Property(e => e.BoxId);
        builder.Property(e => e.Name).IsRequired();
        builder.Property(e => e.Provider).IsRequired();
        builder.Property(e => e.ServerId);
        builder.Property(e => e.Ipv4);
        builder.Property(e => e.Ipv6);
        builder.Property(e => e.ServerType);
        builder.Property(e => e.Location);
        builder.Property(e => e.Hostname);
        builder.Property(e => e.Role);
        builder.Property(e => e.SshUser);
        builder.Property(e => e.SshKeyPath);
        builder.Property(e => e.SshKeyName);
        builder.Property(e => e.StackDir);
        builder.Property(e => e.EdgeDir);
        builder.Property(e => e.EdgeContainer);
        builder.Property(e => e.DockerNetwork);
        builder.Property(e => e.PortBand);
        builder.Property(e => e.ComposePath);
        builder.Property(e => e.EnvDir);
        builder.Property(e => e.Notes);
        builder.Property(e => e.Ordinal).IsRequired();
        builder.Property(e => e.LastChanged).IsRequired();

        builder.HasIndex(e => e.Name).IsUnique().HasDatabaseName("UX_Boxes_Name");
    }
}
