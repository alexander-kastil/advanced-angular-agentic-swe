namespace SecretsMcp.Config;

public static class ConfigOwnership
{
    public const string IntegrationsAt = "integrations.at";

    private static readonly (string Prefix, string App, string Service)[] Rules =
    [
        ("SECRETS_CORS", "secrets", "secrets-ui"),
        ("SECRETS_TEAM_", "secrets", "secrets-mcp"),
        ("SECRETS_", "secrets", "secrets-mcp"),
        ("WORKTIME_", "worktime", "worktime-mcp"),
        ("INTEGRATIONS_API_", IntegrationsAt, "api.integrations.at"),
        ("API_", IntegrationsAt, "api.integrations.at"),
        ("GRAPH_MAILING_", IntegrationsAt, "api.integrations.at"),
        ("AZURE_MONITOR_", IntegrationsAt, "api.integrations.at"),
        ("HOSTS_WEB_", IntegrationsAt, "integrations.at"),
        ("WEB_BUILD_ARG_", IntegrationsAt, "integrations.at"),
        ("APP_SOURCE_WEB", IntegrationsAt, "integrations.at"),
        ("HOSTS_API_", IntegrationsAt, "api.integrations.at"),
        ("APP_SOURCE_API", IntegrationsAt, "api.integrations.at"),
        ("HOSTS_ADMIN_", IntegrationsAt, "admin.integrations.at"),
        ("APP_SOURCE_ADMIN", IntegrationsAt, "admin.integrations.at"),
        ("HOSTS_DASHBOARD_", IntegrationsAt, "dashboard.integrations.at"),
        ("APP_SOURCE_DASHBOARD", IntegrationsAt, "dashboard.integrations.at"),
        ("DASHBOARD_", IntegrationsAt, "dashboard.integrations.at"),
        ("BOX_", IntegrationsAt, "box"),
        ("EDGE_", IntegrationsAt, "box"),
        ("REGISTRY", IntegrationsAt, "box"),
        ("IMAGE_PREFIX", IntegrationsAt, "box"),
        ("SQL_", IntegrationsAt, "box"),
        ("DB_", IntegrationsAt, "box"),
        ("IDENTITY_", IntegrationsAt, "box"),
        ("DNS_", IntegrationsAt, "box"),
        ("DEPLOY_", IntegrationsAt, "box"),
        ("CI_", IntegrationsAt, "box"),
        ("RETIRED_AZURE_", IntegrationsAt, "box"),
        ("ENV_DIR", IntegrationsAt, "box"),
        ("STACK_DIR", IntegrationsAt, "box"),
        ("LOCK_FILE", IntegrationsAt, "box"),
        ("APPS", IntegrationsAt, "box"),
        ("SLOTS", IntegrationsAt, "box"),
        ("SLOT_ROLES", IntegrationsAt, "box"),
        ("ACTIVE_SLOT", IntegrationsAt, "box"),
        ("LIVE_ROLE", IntegrationsAt, "box"),
        ("DEFAULT_BRANCH", IntegrationsAt, "box"),
        ("CANDIDATE_BRANCH", IntegrationsAt, "box"),
        ("AUTO_DEPLOY_SLOT", IntegrationsAt, "box"),
        ("DOMAIN", IntegrationsAt, "box"),
        ("HOSTS", IntegrationsAt, "box"),
    ];

    public static (string? App, string? Service) For(string key)
    {
        foreach (var rule in Rules.OrderByDescending(r => r.Prefix.Length))
        {
            if (key.StartsWith(rule.Prefix, StringComparison.Ordinal))
            {
                return (rule.App, rule.Service);
            }
        }

        return (null, null);
    }
}
