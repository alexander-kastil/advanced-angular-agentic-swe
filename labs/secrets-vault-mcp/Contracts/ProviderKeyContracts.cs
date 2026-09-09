using System.ComponentModel;

namespace SecretsMcp.Contracts;

public sealed record ProviderKeyDto(
    string Provider,
    string ServiceKey,
    string Label,
    string? BaseUrl,
    string? Last4,
    DateTime UpdatedAt,
    int Version);

public sealed record SetProviderKeyRequest(
    [property: Description("The credential itself. Written once and never read back through any route.")] string Key,
    [property: Description("The display label for this row, for example 'DeepSeek API Key'. Required when creating a new row; omit on an update to keep the current one.")] string? Label,
    [property: Description("The provider's base url for this service key, or omit to keep the current one.")] string? BaseUrl);

public sealed record ProviderKeyConnectivityResult(string Status);

public sealed record ResolveProviderKeyResponse(string Value, string? BaseUrl);
