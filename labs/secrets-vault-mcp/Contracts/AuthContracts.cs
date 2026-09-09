namespace SecretsMcp.Contracts;

public sealed record LoginRequest(string Name, string Password);

public sealed record LoginResponse(string Token, DateTimeOffset ExpiresAt, string Name, IReadOnlyList<string> Roles);

public sealed record AuthMeResponse(string Name, IReadOnlyList<string> Roles, IReadOnlyList<string> Permissions);
