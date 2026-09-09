using System.Net.Http.Headers;

namespace SecretsMcp.Services;

public sealed class ProviderConnectivityTester(HttpClient httpClient) : IProviderConnectivityTester
{
    public async Task<bool> TestAsync(string provider, string baseUrl, string credential, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(baseUrl))
        {
            return false;
        }

        try
        {
            using var request = BuildRequest(provider, baseUrl.TrimEnd('/'), credential);
            using var response = await httpClient.SendAsync(
                request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or UriFormatException)
        {
            return false;
        }
    }

    private static HttpRequestMessage BuildRequest(string provider, string baseUrl, string credential)
    {
        if (string.Equals(provider, "anthropic", StringComparison.OrdinalIgnoreCase))
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"{baseUrl}/v1/models");
            request.Headers.Add("x-api-key", credential);
            request.Headers.Add("anthropic-version", "2023-06-01");
            return request;
        }

        var openAiCompatible = new HttpRequestMessage(HttpMethod.Get, $"{baseUrl}/models");
        openAiCompatible.Headers.Authorization = new AuthenticationHeaderValue("Bearer", credential);
        return openAiCompatible;
    }
}
