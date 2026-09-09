namespace SecretsMcp.Data.Entities;

public static class BoxCredentialKind
{
    public const string SshKey = "ssh-key";
    public const string Password = "password";
    public const string ApiToken = "api-token";

    public static readonly IReadOnlyList<string> All = [SshKey, Password, ApiToken];

    public static bool IsKnown(string kind) => All.Contains(kind);
}
