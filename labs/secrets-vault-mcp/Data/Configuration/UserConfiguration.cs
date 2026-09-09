using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(e => e.UserId).HasName("PK_Users");

        builder.Property(e => e.Name).IsRequired();
        builder.Property(e => e.PasswordHash).IsRequired();
        builder.Property(e => e.IsActive).IsRequired();
        builder.Property(e => e.CreatedAt).IsRequired();

        builder.HasIndex(e => e.Name).IsUnique().HasDatabaseName("UX_Users_Name");
    }
}
