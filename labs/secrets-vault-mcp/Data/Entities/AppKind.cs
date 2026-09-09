namespace SecretsMcp.Data.Entities;

public static class AppKind
{
    public const string Api = "api";
    public const string Ui = "ui";
    public const string Mcp = "mcp";
    public const string Cli = "cli";
    public const string Agent = "agent";
    public const string Site = "site";
    public const string Team = "team";
    public const string App = "app";

    public static readonly IReadOnlyList<string> All = [Api, Ui, Mcp, Cli, Agent, Site, Team, App];

    public static bool IsKnown(string kind) => All.Contains(kind);
}
