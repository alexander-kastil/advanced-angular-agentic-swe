using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class McpServerConfiguration : IEntityTypeConfiguration<McpServer>
{
    public void Configure(EntityTypeBuilder<McpServer> builder)
    {
        builder.ToTable("McpServers");

        builder.HasKey(e => e.McpServerId).HasName("PK_McpServers");

        builder.Property(e => e.McpServerId);
        builder.Property(e => e.Name).IsRequired();
        builder.Property(e => e.Label).IsRequired();
        builder.Property(e => e.Transport).IsRequired();
        builder.Property(e => e.Url);
        builder.Property(e => e.Command);
        builder.Property(e => e.Args);
        builder.Property(e => e.HeaderName);
        builder.Property(e => e.Description);
        builder.Property(e => e.Icon);
        builder.Property(e => e.IconContentType);
        builder.Property(e => e.Ordinal).IsRequired();
        builder.Property(e => e.UpdatedAt).IsRequired();

        builder.HasIndex(e => e.Name).IsUnique().HasDatabaseName("UX_McpServers_Name");
    }
}
