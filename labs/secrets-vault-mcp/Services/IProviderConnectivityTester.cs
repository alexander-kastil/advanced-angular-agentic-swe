namespace SecretsMcp.Services;

public interface IProviderConnectivityTester
{
    Task<bool> TestAsync(string provider, string baseUrl, string credential, CancellationToken cancellationToken);
}
