namespace SecretsMcp.Data.Encryption;

[AttributeUsage(AttributeTargets.Property)]
public sealed class DbEncryptedAttribute(int maxLength) : Attribute
{
    public int MaxLength { get; } = maxLength;
}
