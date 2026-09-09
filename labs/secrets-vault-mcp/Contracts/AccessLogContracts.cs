namespace SecretsMcp.Contracts;

public sealed record AccessLogEntryDto(
    Guid AccessLogId,
    DateTime OccurredAt,
    string Action,
    string EntityType,
    string? EntityName,
    Guid? EntityId,
    string UserName,
    string IpAddress,
    string? Details);

public sealed record AccessLogPageDto(
    int Total,
    IReadOnlyList<AccessLogEntryDto> Entries);

public sealed record AccessLogSettingsDto(bool RecordCodingAgentOnly);

public sealed record UpdateAccessLogSettingsRequest(bool RecordCodingAgentOnly);
