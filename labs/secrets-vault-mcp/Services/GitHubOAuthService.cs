using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using SecretsMcp.Contracts;

namespace SecretsMcp.Services;

/// <summary>
/// The GitHub OAuth <b>device flow</b> for the single service connection: request a device/user
/// code, poll until the user authorizes at <c>github.com/login/device</c>, resolve the connected
/// login, and list the user's repositories. Only a public <c>Client ID</c> is required (device
/// flow uses no client secret); it is read from configuration key <c>GitHub:ClientId</c>.
/// </summary>
public sealed class GitHubOAuthService(IHttpClientFactory httpClientFactory, IConfiguration configuration) : IGitHubOAuthService
{
    private const string ClientName = "github";
    private const string DeviceCodeUrl = "https://github.com/login/device/code";
    private const string TokenUrl = "https://github.com/login/oauth/access_token";
    private const string UserUrl = "https://api.github.com/user";
    private const string ReposUrl = "https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member";
    private const string GrantType = "urn:ietf:params:oauth:grant-type:device_code";
    private const string Scope = "repo read:org";
    private const int SlowDownSeconds = 5;

    private string? ClientId => configuration["GitHub:ClientId"];

    public bool IsConfigured => !string.IsNullOrWhiteSpace(ClientId);

    public async Task<GitHubDeviceStart?> StartDeviceAsync(CancellationToken cancellationToken)
    {
        var http = httpClientFactory.CreateClient(ClientName);
        var request = new HttpRequestMessage(HttpMethod.Post, DeviceCodeUrl)
        {
            Content = JsonContent.Create(new { client_id = ClientId, scope = Scope }),
        };
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var response = await http.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode) return null;

        var body = await response.Content.ReadFromJsonAsync<DeviceCodeResponse>(cancellationToken);
        if (body is null || string.IsNullOrWhiteSpace(body.DeviceCode)) return null;

        return new GitHubDeviceStart(
            body.DeviceCode,
            body.UserCode ?? "",
            body.VerificationUri ?? "",
            body.ExpiresIn,
            body.Interval > 0 ? body.Interval : 5);
    }

    public async Task<GitHubPollResult> PollTokenAsync(string deviceCode, CancellationToken cancellationToken)
    {
        var http = httpClientFactory.CreateClient(ClientName);
        var request = new HttpRequestMessage(HttpMethod.Post, TokenUrl)
        {
            Content = JsonContent.Create(new { client_id = ClientId, device_code = deviceCode, grant_type = GrantType }),
        };
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var response = await http.SendAsync(request, cancellationToken);
        var body = await response.Content.ReadFromJsonAsync<TokenResponse>(cancellationToken);

        if (!string.IsNullOrWhiteSpace(body?.AccessToken))
            return new GitHubPollResult(body.AccessToken, null, 0);

        var error = body?.Error ?? "unknown";
        var interval = string.Equals(error, "slow_down", StringComparison.Ordinal)
            ? (body?.Interval ?? 0) + SlowDownSeconds
            : body?.Interval ?? 0;

        return new GitHubPollResult(null, error, interval);
    }

    public async Task<string> FetchLoginAsync(string token, CancellationToken cancellationToken)
    {
        var body = await GetAsync<UserResponse>(UserUrl, token, cancellationToken);
        return body?.Login ?? "";
    }

    public async Task<IReadOnlyList<GitHubRepoDto>> ListReposAsync(string token, CancellationToken cancellationToken)
    {
        var body = await GetAsync<RepoResponse[]>(ReposUrl, token, cancellationToken);
        if (body is null) return [];

        return body
            .Where(r => !string.IsNullOrWhiteSpace(r.FullName))
            .Select(r => new GitHubRepoDto(
                r.FullName!,
                r.Name ?? "",
                r.Owner?.Login ?? "",
                r.Description,
                r.Private,
                r.DefaultBranch ?? "",
                r.HtmlUrl ?? "",
                r.UpdatedAt ?? DateTime.MinValue))
            .ToArray();
    }

    private async Task<T?> GetAsync<T>(string url, string token, CancellationToken cancellationToken)
    {
        var http = httpClientFactory.CreateClient(ClientName);
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.github+json"));

        var response = await http.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode) return default;
        return await response.Content.ReadFromJsonAsync<T>(cancellationToken);
    }

    private sealed record DeviceCodeResponse(
        [property: JsonPropertyName("device_code")] string? DeviceCode,
        [property: JsonPropertyName("user_code")] string? UserCode,
        [property: JsonPropertyName("verification_uri")] string? VerificationUri,
        [property: JsonPropertyName("expires_in")] int ExpiresIn,
        [property: JsonPropertyName("interval")] int Interval);

    private sealed record TokenResponse(
        [property: JsonPropertyName("access_token")] string? AccessToken,
        [property: JsonPropertyName("error")] string? Error,
        [property: JsonPropertyName("interval")] int Interval);

    private sealed record UserResponse([property: JsonPropertyName("login")] string? Login);

    private sealed record RepoResponse(
        [property: JsonPropertyName("full_name")] string? FullName,
        [property: JsonPropertyName("name")] string? Name,
        [property: JsonPropertyName("owner")] OwnerResponse? Owner,
        [property: JsonPropertyName("description")] string? Description,
        [property: JsonPropertyName("private")] bool Private,
        [property: JsonPropertyName("default_branch")] string? DefaultBranch,
        [property: JsonPropertyName("html_url")] string? HtmlUrl,
        [property: JsonPropertyName("updated_at")] DateTime? UpdatedAt);

    private sealed record OwnerResponse([property: JsonPropertyName("login")] string? Login);
}
