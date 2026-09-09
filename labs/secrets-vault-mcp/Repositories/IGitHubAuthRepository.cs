namespace SecretsMcp.Repositories;

public interface IGitHubAuthRepository
{
    Task<(bool Connected, string? Login)> GetStatusAsync(CancellationToken cancellationToken);

    Task<string?> GetTokenAsync(CancellationToken cancellationToken);

    Task SaveAsync(string token, string login, CancellationToken cancellationToken);

    Task ClearAsync(CancellationToken cancellationToken);
}
