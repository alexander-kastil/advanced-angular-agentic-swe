using Microsoft.EntityFrameworkCore;

namespace SecretsMcp.Data.Encryption;

public interface IDbValueCipher
{
    string Passphrase { get; }
    void Validate(object entity);
    Task WriteAsync(DbContext db, object entity, CancellationToken cancellationToken);
}
