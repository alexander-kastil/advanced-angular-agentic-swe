using System.Security.Cryptography;
using System.Text;

namespace SecretsMcp.Data.Encryption;

public static class SqliteValueCrypto
{
    private const int NonceBytes = 12;
    private const int TagBytes = 16;

    public static byte[] Encrypt(string plaintext, string passphrase)
    {
        var key = DeriveKey(passphrase);
        var nonce = RandomNumberGenerator.GetBytes(NonceBytes);
        var plainBytes = Encoding.UTF8.GetBytes(plaintext);
        var cipherBytes = new byte[plainBytes.Length];
        var tag = new byte[TagBytes];

        using var aes = new AesGcm(key, TagBytes);
        aes.Encrypt(nonce, plainBytes, cipherBytes, tag);

        var result = new byte[NonceBytes + cipherBytes.Length + TagBytes];
        Buffer.BlockCopy(nonce, 0, result, 0, NonceBytes);
        Buffer.BlockCopy(cipherBytes, 0, result, NonceBytes, cipherBytes.Length);
        Buffer.BlockCopy(tag, 0, result, NonceBytes + cipherBytes.Length, TagBytes);
        return result;
    }

    public static string? Decrypt(byte[]? cipher, string passphrase)
    {
        if (cipher is null || cipher.Length < NonceBytes + TagBytes)
        {
            return null;
        }

        try
        {
            var key = DeriveKey(passphrase);
            var nonce = cipher.AsSpan(0, NonceBytes);
            var tag = cipher.AsSpan(cipher.Length - TagBytes, TagBytes);
            var cipherBytes = cipher.AsSpan(NonceBytes, cipher.Length - NonceBytes - TagBytes);
            var plainBytes = new byte[cipherBytes.Length];

            using var aes = new AesGcm(key, TagBytes);
            aes.Decrypt(nonce, cipherBytes, tag, plainBytes);

            return Encoding.UTF8.GetString(plainBytes);
        }
        catch (CryptographicException)
        {
            return null;
        }
    }

    private static byte[] DeriveKey(string passphrase) =>
        SHA256.HashData(Encoding.UTF8.GetBytes(passphrase));
}
