namespace SecretsMcp.Repositories;

public sealed class SecretNameConflictException(string message) : Exception(message);
