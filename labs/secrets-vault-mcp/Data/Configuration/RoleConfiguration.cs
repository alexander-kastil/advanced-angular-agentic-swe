using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");

        builder.HasKey(e => e.RoleId).HasName("PK_Roles");

        builder.Property(e => e.Name).IsRequired();

        builder.HasIndex(e => e.Name).IsUnique().HasDatabaseName("UX_Roles_Name");
    }
}
