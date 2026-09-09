using Microsoft.AspNetCore.Authorization;
using SecretsMcp.Config;

namespace SecretsMcp.Auth;

public static class AuthorizationPolicies
{
    public const string Owner = "Spa";
    public const string Customer = "Customer";
    public const string CustomerOrMachine = "CustomerOrMachine";
    public const string MachineOnly = "MachineOnly";
    public const string Agent = "Agent";

    public const string OwnerRole = "Owner";
    public const string CustomerRole = "Customer";

    public const string AppsGrant = "secrets-mcp/apps";
    public const string BoxesGrant = "secrets-mcp/boxes";
    public const string CategoriesGrant = "secrets-mcp/categories";
    public const string EnvironmentsGrant = "secrets-mcp/environments";
    public const string ReposGrant = "secrets-mcp/repos";
    public const string SettingsGrant = "secrets-mcp/settings";
    public const string SecretsGrant = "secrets-mcp/secrets";
    public const string ListsGrant = "secrets-mcp/lists";
    public const string ModelsGrant = "secrets-mcp/models";
    public const string ProviderKeysGrant = "secrets-mcp/providerkeys";

    public const string AgentApps = Agent + ":" + AppsGrant;
    public const string AgentBoxes = Agent + ":" + BoxesGrant;
    public const string AgentCategories = Agent + ":" + CategoriesGrant;
    public const string AgentEnvironments = Agent + ":" + EnvironmentsGrant;
    public const string AgentRepos = Agent + ":" + ReposGrant;
    public const string AgentSettings = Agent + ":" + SettingsGrant;
    public const string AgentSecrets = Agent + ":" + SecretsGrant;
    public const string AgentLists = Agent + ":" + ListsGrant;
    public const string AgentModels = Agent + ":" + ModelsGrant;
    public const string AgentProviderKeys = Agent + ":" + ProviderKeysGrant;

    public static readonly string[] AgentOpenGrants =
        [AppsGrant, BoxesGrant, CategoriesGrant, EnvironmentsGrant, ReposGrant, SettingsGrant, ModelsGrant, ProviderKeysGrant];

    public static readonly string[] AgentClosedGrants = [SecretsGrant, ListsGrant];

    public static readonly string[] AgentGrants =
        [AppsGrant, BoxesGrant, CategoriesGrant, EnvironmentsGrant, ReposGrant, SettingsGrant, SecretsGrant, ListsGrant, ModelsGrant, ProviderKeysGrant];

    public static string AgentPolicyName(string grant) => $"{Agent}:{grant}";

    public static Action<AuthorizationPolicyBuilder> BuildOwnerPolicy(AppConfig cfg) => policy =>
    {
        policy.AddAuthenticationSchemes(LocalAuthDefaults.AuthenticationScheme);
        if (cfg.Auth.Enabled)
            policy.RequireRole(OwnerRole);
        else
            policy.RequireAssertion(_ => true);
    };

    public static Action<AuthorizationPolicyBuilder> BuildCustomerPolicy(AppConfig cfg) => policy =>
    {
        policy.AddAuthenticationSchemes(LocalAuthDefaults.AuthenticationScheme);
        if (cfg.Auth.Enabled)
            policy.RequireRole(OwnerRole, CustomerRole);
        else
            policy.RequireAssertion(_ => true);
    };

    public static Action<AuthorizationPolicyBuilder> BuildCustomerOrMachinePolicy(AppConfig cfg) => policy =>
    {
        policy.AddAuthenticationSchemes(LocalAuthDefaults.AuthenticationScheme, McpApiKeyAuthHandler.SchemeName);
        policy.RequireAssertion(context =>
        {
            if (context.User.Identities.Any(identity => identity.AuthenticationType == McpApiKeyAuthHandler.SchemeName))
                return true;

            if (!cfg.Auth.Enabled)
                return true;

            return context.User.IsInRole(OwnerRole) || context.User.IsInRole(CustomerRole);
        });
    };

    public static Action<AuthorizationPolicyBuilder> BuildAgentPolicy(AppConfig cfg, string requiredGrant) => policy =>
    {
        policy.AddAuthenticationSchemes(LocalAuthDefaults.AuthenticationScheme, McpApiKeyAuthHandler.SchemeName);
        policy.RequireAssertion(context =>
        {
            if (context.User.Identities.Any(identity => identity.AuthenticationType == McpApiKeyAuthHandler.SchemeName))
                return context.User.FindAll(McpApiKeyAuthHandler.GrantClaimType)
                    .Any(claim => string.Equals(claim.Value, requiredGrant, StringComparison.OrdinalIgnoreCase));

            if (!cfg.Auth.Enabled)
                return true;

            return context.User.IsInRole(OwnerRole) || context.User.IsInRole(CustomerRole);
        });
    };

    public static Action<AuthorizationPolicyBuilder> BuildMachineOnlyPolicy() => policy =>
    {
        policy.AddAuthenticationSchemes(McpApiKeyAuthHandler.SchemeName);
        policy.RequireAssertion(context =>
            context.User.Identities.Any(identity => identity.AuthenticationType == McpApiKeyAuthHandler.SchemeName));
    };
}
