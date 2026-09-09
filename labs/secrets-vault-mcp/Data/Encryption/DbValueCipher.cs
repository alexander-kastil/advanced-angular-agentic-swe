using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using SecretsMcp.Config;

namespace SecretsMcp.Data.Encryption;

public sealed class DbValueCipher : IDbValueCipher
{
    public DbValueCipher(AppConfig config)
    {
        if (string.IsNullOrWhiteSpace(config.DbEncryptionKey) || config.DbEncryptionKey.Length > 128)
        {
            throw new InvalidOperationException(
                "DBEncryptionKey must be configured and at most 128 characters long.");
        }

        Passphrase = config.DbEncryptionKey;
    }

    public string Passphrase { get; }

    public void Validate(object entity)
    {
        var type = entity.GetType();
        foreach (var p in EncryptedProperties.For(type))
        {
            var value = p.ReadPlaintext(entity);
            if (value is not null && value.Length > p.MaxLength)
            {
                throw new ArgumentException(
                    $"'{type.Name}.{p.Name}' is {value.Length} characters long, which exceeds the maximum of {p.MaxLength}.");
            }
        }
    }

    public async Task WriteAsync(DbContext db, object entity, CancellationToken cancellationToken)
    {
        Validate(entity);

        var type = entity.GetType();
        var pending = EncryptedProperties.For(type).Where(p => p.ReadPlaintext(entity) is not null).ToList();
        if (pending.Count == 0) return;

        var entityType = db.Model.FindEntityType(type)
            ?? throw new InvalidOperationException($"'{type.Name}' is not part of the model.");
        var table = entityType.GetTableName() ?? throw new InvalidOperationException($"'{type.Name}' is not mapped to a table.");
        var keyProperties = entityType.FindPrimaryKey()?.Properties
            ?? throw new InvalidOperationException($"'{type.Name}' has no primary key.");
        if (keyProperties.Count == 0)
            throw new InvalidOperationException($"'{type.Name}' has no primary key.");

        var assignments = new List<string>();
        var whereClauses = new List<string>();

        var connection = db.Database.GetDbConnection();
        if (connection.State != ConnectionState.Open)
        {
            await connection.OpenAsync(cancellationToken);
        }

        await using var command = connection.CreateCommand();
        command.Transaction = db.Database.CurrentTransaction?.GetDbTransaction();

        for (var i = 0; i < keyProperties.Count; i++)
        {
            var keyColumn = keyProperties[i].GetColumnName()
                ?? throw new InvalidOperationException($"'{type.Name}' primary key has no column.");
            whereClauses.Add($"[{keyColumn}] = @k{i}");

            var keyParameter = command.CreateParameter();
            keyParameter.ParameterName = $"@k{i}";
            keyParameter.Value = keyProperties[i].PropertyInfo!.GetValue(entity) ?? DBNull.Value;
            command.Parameters.Add(keyParameter);
        }

        for (var i = 0; i < pending.Count; i++)
        {
            assignments.Add($"[{pending[i].CipherColumnName}] = @v{i}");

            var valueParameter = command.CreateParameter();
            valueParameter.ParameterName = $"@v{i}";
            valueParameter.Value = SqliteValueCrypto.Encrypt(pending[i].ReadPlaintext(entity)!, Passphrase);
            command.Parameters.Add(valueParameter);
        }

        command.CommandText =
            $"""
            UPDATE [{table}]
            SET {string.Join(", ", assignments)}
            WHERE {string.Join(" AND ", whereClauses)};
            """;

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);

        if (rowsAffected != 1)
            throw new InvalidOperationException($"Encrypting {type.Name} affected {rowsAffected} rows, expected 1.");
    }
}
