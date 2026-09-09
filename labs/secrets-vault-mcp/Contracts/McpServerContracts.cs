namespace SecretsMcp.Contracts;

public sealed record McpServerDto(
    Guid McpServerId,
    string Name,
    string Label,
    string Transport,
    string? Url,
    string? Command,
    string? Args,
    string? HeaderName,
    bool HasApiKey,
    string? Description,
    byte[]? Icon,
    string? IconContentType,
    int Ordinal,
    DateTime UpdatedAt);

public sealed record CreateMcpServerRequest(
    string Name,
    string Label,
    string Transport,
    string? Url,
    string? Command,
    string? Args,
    string? HeaderName,
    string? ApiKey,
    string? Description,
    int? Ordinal);

public sealed record UpdateMcpServerRequest(
    string Label,
    string Transport,
    string? Url,
    string? Command,
    string? Args,
    string? HeaderName,
    string? ApiKey,
    string? Description,
    int? Ordinal);
