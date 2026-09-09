using Microsoft.EntityFrameworkCore;

namespace SecretsMcp.Data.Encryption;

public static class EncryptedModelBuilderExtensions
{
    public static ModelBuilder ApplyDbEncryption(this ModelBuilder modelBuilder)
    {
        var clrTypes = modelBuilder.Model.GetEntityTypes().Select(e => e.ClrType).Distinct().ToList();

        foreach (var clrType in clrTypes)
        {
            foreach (var p in EncryptedProperties.For(clrType))
            {
                var entity = modelBuilder.Entity(clrType);
                entity.Ignore(p.Name);
                entity.Property(p.CipherPropertyName).HasColumnName(p.CipherColumnName);
            }
        }

        return modelBuilder;
    }
}
