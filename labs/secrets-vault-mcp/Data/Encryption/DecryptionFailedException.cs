namespace SecretsMcp.Data.Encryption;

public sealed class DecryptionFailedException(string message) : Exception(message);
