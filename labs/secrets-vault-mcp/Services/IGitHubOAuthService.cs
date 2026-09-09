using SecretsMcp.Contracts;

namespace SecretsMcp.Services;

public sealed record GitHubDeviceStart(string DeviceCode, string UserCode, string VerificationUri, int ExpiresIn, int Interval);

public sealed record GitHubPollResult(string? Token, string? Error, int Interval);

public interface IGitHubOAuthService
{
    bool IsConfigured { get; }

    Task<GitHubDeviceStart?> StartDeviceAsync(CancellationToken cancellationToken);

    Task<GitHubPollResult> PollTokenAsync(string deviceCode, CancellationToken cancellationToken);

    Task<string> FetchLoginAsync(string token, CancellationToken cancellationToken);

    Task<IReadOnlyList<GitHubRepoDto>> ListReposAsync(string token, CancellationToken cancellationToken);
}
