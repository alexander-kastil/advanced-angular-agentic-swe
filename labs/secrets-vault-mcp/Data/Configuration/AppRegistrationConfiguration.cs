using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class AppRegistrationConfiguration : IEntityTypeConfiguration<AppRegistration>
{
    public void Configure(EntityTypeBuilder<AppRegistration> builder)
    {
        builder.ToTable("AppRegistrations");

        builder.HasKey(e => e.AppId).HasName("PK_AppRegistrations");

        builder.Property(e => e.AppId);
        builder.Property(e => e.DisplayName).IsRequired();
        builder.Property(e => e.ClientId);
        builder.Property(e => e.TenantId);
        builder.Property(e => e.ObjectId);
        builder.Property(e => e.SignInAudience);
        builder.Property(e => e.Notes);
        builder.Property(e => e.LastChanged).IsRequired();

        builder.HasOne(e => e.App)
            .WithOne(a => a.Registration)
            .HasForeignKey<AppRegistration>(e => e.AppId)
            .HasConstraintName("FK_AppRegistrations_Apps_AppId")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
