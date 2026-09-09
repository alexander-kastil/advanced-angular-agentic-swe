using System.Data.Common;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace SecretsMcp.Data.Encryption;

public sealed class SqliteDecryptFunctionInterceptor : DbConnectionInterceptor
{
    public override void ConnectionOpened(DbConnection connection, ConnectionEndEventData eventData)
    {
        Register(connection);
    }

    public override async Task ConnectionOpenedAsync(
        DbConnection connection, ConnectionEndEventData eventData, CancellationToken cancellationToken = default)
    {
        Register(connection);
        await Task.CompletedTask;
    }

    private static void Register(DbConnection connection)
    {
        if (connection is SqliteConnection sqliteConnection)
        {
            sqliteConnection.CreateFunction<byte[]?, string, string?>(
                "DecryptDbValue",
                SqliteValueCrypto.Decrypt);
        }
    }
}
