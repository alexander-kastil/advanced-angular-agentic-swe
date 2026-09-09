namespace SecretsMcp.Data.Entities;

public static class EnvironmentType
{
    public const string Dev = "dev";
    public const string Blue = "blue";
    public const string Green = "green";

    public static readonly IReadOnlyList<string> All = [Dev, Blue, Green];

    public static bool IsKnown(string type) => All.Contains(type);
}
