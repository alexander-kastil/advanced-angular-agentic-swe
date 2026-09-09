using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data.Configuration;

public sealed class AccessLogEntryConfiguration : IEntityTypeConfiguration<AccessLogEntry>
{
    public void Configure(EntityTypeBuilder<AccessLogEntry> builder)
    {
        builder.ToTable("AccessLog");

        builder.HasKey(e => e.AccessLogId).HasName("PK_AccessLog");

        builder.Property(e => e.AccessLogId);
        builder.Property(e => e.OccurredAt).IsRequired();
        builder.Property(e => e.Action).IsRequired();
        builder.Property(e => e.EntityType).IsRequired();
        builder.Property(e => e.EntityName);
        builder.Property(e => e.EntityId);
        builder.Property(e => e.UserName).IsRequired();
        builder.Property(e => e.IpAddress).IsRequired();
        builder.Property(e => e.Details);

        builder.HasIndex(e => e.OccurredAt).IsDescending().HasDatabaseName("IX_AccessLog_OccurredAt");
    }
}
