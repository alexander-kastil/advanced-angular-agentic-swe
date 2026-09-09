using System.Collections.Concurrent;
using System.Reflection;

namespace SecretsMcp.Data.Encryption;

public sealed record EncryptedProperty(
    string Name,
    string CipherPropertyName,
    string CipherColumnName,
    int MaxLength,
    Func<object, string?> ReadPlaintext);

public static class EncryptedProperties
{
    public const string CipherSuffix = "Cipher";
    public const int CipherColumnBytes = 8000;
    public const int MaxEncryptableChars = 3979;

    private static readonly ConcurrentDictionary<Type, IReadOnlyList<EncryptedProperty>> Cache = new();

    public static IReadOnlyList<EncryptedProperty> For(Type entityType) =>
        Cache.GetOrAdd(entityType, Discover);

    private static IReadOnlyList<EncryptedProperty> Discover(Type entityType)
    {
        var result = new List<EncryptedProperty>();

        foreach (var property in entityType.GetProperties(BindingFlags.Public | BindingFlags.Instance))
        {
            var attribute = property.GetCustomAttribute<DbEncryptedAttribute>();
            if (attribute is null)
            {
                continue;
            }

            if (property.PropertyType != typeof(string))
            {
                throw new InvalidOperationException(
                    $"'{entityType.Name}.{property.Name}' is marked [DbEncrypted] but is not 'string?'.");
            }

            if (attribute.MaxLength > MaxEncryptableChars)
            {
                throw new InvalidOperationException(
                    $"'{entityType.Name}.{property.Name}' has MaxLength {attribute.MaxLength}, which exceeds the ENCRYPTBYPASSPHRASE ceiling of {MaxEncryptableChars}.");
            }

            var cipherPropertyName = property.Name + CipherSuffix;

            var cipherProperty = entityType.GetProperty(cipherPropertyName, BindingFlags.Public | BindingFlags.Instance);
            if (cipherProperty is null || cipherProperty.PropertyType != typeof(byte[]))
            {
                throw new InvalidOperationException(
                    $"'{entityType.Name}' has [DbEncrypted] property '{property.Name}' but no matching 'byte[]? {cipherPropertyName}' property.");
            }

            result.Add(new EncryptedProperty(
                property.Name,
                cipherPropertyName,
                property.Name,
                attribute.MaxLength,
                entity => (string?)property.GetValue(entity)));
        }

        return result;
    }
}
