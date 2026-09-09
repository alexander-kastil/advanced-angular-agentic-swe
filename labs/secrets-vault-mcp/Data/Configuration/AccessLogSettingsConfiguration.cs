using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class AccessLogSettingsConfiguration : IEntityTypeConfiguration<AccessLogSettings>
{
    public void Configure(EntityTypeBuilder<AccessLogSettings> builder)
    {
        builder.ToTable("AccessLogSettings");

        builder.HasKey(e => e.Id).HasName("PK_AccessLogSettings");

        builder.Property(e => e.Id);
        builder.Property(e => e.RecordCodingAgentOnly).IsRequired();
        builder.Property(e => e.LastChanged).IsRequired();
    }
}
