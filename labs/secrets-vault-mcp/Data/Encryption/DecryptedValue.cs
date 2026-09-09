namespace SecretsMcp.Data.Encryption;

public static class DecryptedValue
{
    public static string? Require(string? value, bool hasCipher, string owner) =>
        hasCipher && value is null
            ? throw new DecryptionFailedException(
                $"The encrypted value on '{owner}' did not decrypt. The configured DBEncryptionKey does not match the key its ciphertext was written with.")
            : value;
}
