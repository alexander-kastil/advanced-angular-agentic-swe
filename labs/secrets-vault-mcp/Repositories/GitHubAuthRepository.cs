using Microsoft.EntityFrameworkCore;
using SecretsMcp.Data;
using SecretsMcp.Data.Encryption;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Repositories;

/// <summary>
/// Persistence for the single GitHub OAuth device-flow connection (one operator, one service
/// identity), the singleton row keyed by <see cref="GitHubAuth.SingletonId"/>. The token is
/// written and read through <see cref="IDbValueCipher"/>, the same way every other stored
/// credential value in this service is, and never reaches the SPA.
/// </summary>
public sealed class GitHubAuthRepository(
    IDbContextFactory<SecretsDbContext> contextFactory,
    IDbValueCipher cipher) : IGitHubAuthRepository
{
    public async Task<(bool Connected, string? Login)> GetStatusAsync(CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var row = await db.GitHubAuth
            .AsNoTracking()
            .Where(r => r.Id == GitHubAuth.SingletonId)
            .Select(r => new { r.Login })
            .FirstOrDefaultAsync(cancellationToken);

        return (row is not null, row?.Login);
    }

    public async Task<string?> GetTokenAsync(CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var row = await db.GitHubAuth
            .AsNoTracking()
            .Where(r => r.Id == GitHubAuth.SingletonId)
            .Select(r => new
            {
                Token = SecretsDbContext.DecryptDbValue(r.TokenCipher, cipher.Passphrase),
                HasCipher = r.TokenCipher != null
            })
            .FirstOrDefaultAsync(cancellationToken);

        return row is null ? null : DecryptedValue.Require(row.Token, row.HasCipher, "GitHubAuth");
    }

    public async Task SaveAsync(string token, string login, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var row = await db.GitHubAuth.FirstOrDefaultAsync(r => r.Id == GitHubAuth.SingletonId, cancellationToken);

        if (row is null)
        {
            row = new GitHubAuth { Id = GitHubAuth.SingletonId };
            db.GitHubAuth.Add(row);
        }

        row.Token = token;
        row.Login = login;
        row.UpdatedUtc = DateTime.UtcNow;

        cipher.Validate(row);

        await using var tx = await db.Database.BeginTransactionAsync(cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        await cipher.WriteAsync(db, row, cancellationToken);
        await tx.CommitAsync(cancellationToken);
    }

    public async Task ClearAsync(CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var row = await db.GitHubAuth.FirstOrDefaultAsync(r => r.Id == GitHubAuth.SingletonId, cancellationToken);
        if (row is null) return;

        db.GitHubAuth.Remove(row);
        await db.SaveChangesAsync(cancellationToken);
    }
}
