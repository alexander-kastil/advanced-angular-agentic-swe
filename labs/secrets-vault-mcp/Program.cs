using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SecretsMcp.Auth;
using SecretsMcp.Config;
using SecretsMcp.Data;
using SecretsMcp.Data.Encryption;
using SecretsMcp.Filters;
using SecretsMcp.Repositories;
using SecretsMcp.Services;
using SecretsMcp.Tools;

const string SpaCors = "Spa";

var builder = WebApplication.CreateBuilder(args);

var cfg = builder.Configuration.Get<AppConfig>() ?? new AppConfig();
builder.Services.AddSingleton(cfg);
builder.Services.AddSingleton<IDbValueCipher, DbValueCipher>();
builder.Services.AddSingleton<LocalTokenService>();

var signingKey = cfg.Auth.LocalJwt.SigningKey;
if (string.IsNullOrWhiteSpace(signingKey) || signingKey.Length < 32)
{
    throw new InvalidOperationException("Auth:LocalJwt:SigningKey must be at least 32 characters.");
}

builder.Services.AddOpenApi();
builder.Services.AddControllers(options => options.Filters.Add<AccessLogFilter>());

var connectionString = builder.Configuration.GetConnectionString("Secrets")
    ?? throw new InvalidOperationException("ConnectionStrings:Secrets must be configured.");
EnsureSqliteDirectoryExists(connectionString);

builder.Services.AddDbContextFactory<SecretsDbContext>(options =>
    options.UseSqlite(connectionString).AddInterceptors(new SqliteDecryptFunctionInterceptor()));

builder.Services.AddScoped<ISecretListRepository, SecretListRepository>();
builder.Services.AddScoped<ISecretRepository, SecretRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IAppRepository, AppRepository>();
builder.Services.AddScoped<IModelRepository, ModelRepository>();
builder.Services.AddScoped<IProviderKeyRepository, ProviderKeyRepository>();
builder.Services.AddScoped<IBoxRepository, BoxRepository>();
builder.Services.AddScoped<IMcpServerRepository, McpServerRepository>();
builder.Services.AddScoped<IGitHubAuthRepository, GitHubAuthRepository>();
builder.Services.AddScoped<IAccessLogRepository, AccessLogRepository>();
builder.Services.AddScoped<IAccessLogSettingsRepository, AccessLogSettingsRepository>();
builder.Services.AddSingleton<IAccessLogSettingsCache, AccessLogSettingsCache>();
builder.Services.AddHostedService<AccessLogRetentionService>();
builder.Services.AddHttpClient<IProviderConnectivityTester, ProviderConnectivityTester>();
builder.Services.AddHttpClient("github", client => client.DefaultRequestHeaders.UserAgent.ParseAdd("secrets-mcp"));
builder.Services.AddSingleton<IGitHubOAuthService, GitHubOAuthService>();
builder.Services.AddSingleton<DockerLogService>();

string[] allowedOrigins = cfg.Cors.AllowedOrigins.Length > 0
    ? cfg.Cors.AllowedOrigins
    : CorsConfig.DefaultAllowedOrigins;

builder.Services.AddCors(options =>
    options.AddPolicy(SpaCors, policy => policy
        .WithOrigins(allowedOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .WithExposedHeaders("Content-Disposition")));

var authBuilder = builder.Services.AddAuthentication(McpApiKeyAuthHandler.SchemeName)
    .AddScheme<AuthenticationSchemeOptions, McpApiKeyAuthHandler>(McpApiKeyAuthHandler.SchemeName, _ => { });

authBuilder.AddJwtBearer(LocalAuthDefaults.AuthenticationScheme, options =>
{
    options.MapInboundClaims = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = cfg.Auth.LocalJwt.Issuer,
        ValidAudience = cfg.Auth.LocalJwt.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
        NameClaimType = "name",
        RoleClaimType = "role"
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Mcp", policy => policy
        .AddAuthenticationSchemes(McpApiKeyAuthHandler.SchemeName)
        .RequireAuthenticatedUser());

    options.AddPolicy(AuthorizationPolicies.Owner, AuthorizationPolicies.BuildOwnerPolicy(cfg));
    options.AddPolicy(AuthorizationPolicies.Customer, AuthorizationPolicies.BuildCustomerPolicy(cfg));
    options.AddPolicy(AuthorizationPolicies.CustomerOrMachine, AuthorizationPolicies.BuildCustomerOrMachinePolicy(cfg));
    options.AddPolicy(AuthorizationPolicies.MachineOnly, AuthorizationPolicies.BuildMachineOnlyPolicy());

    foreach (var grant in AuthorizationPolicies.AgentGrants)
        options.AddPolicy(AuthorizationPolicies.AgentPolicyName(grant), AuthorizationPolicies.BuildAgentPolicy(cfg, grant));
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddMcpServer()
    .WithHttpTransport()
    .AddAuthorizationFilters()
    .WithTools<SecretListTools>()
    .WithTools<SecretTools>()
    .WithTools<CategoryTools>()
    .WithTools<AppTools>()
    .WithTools<BoxTools>()
    .WithTools<ModelTools>()
    .WithTools<ProviderKeyTools>();

builder.Services.AddHealthChecks();

var app = builder.Build();

await BootstrapDatabaseAsync(app.Services, connectionString);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.UseWebSockets(new WebSocketOptions { KeepAliveInterval = TimeSpan.FromSeconds(30) });

app.MapControllers().RequireCors(SpaCors);

app.MapMcp("/mcp").RequireAuthorization("Mcp");

app.MapHealthChecks("/health").AllowAnonymous();

app.Run();

static void EnsureSqliteDirectoryExists(string connectionString)
{
    var dataSource = new SqliteConnectionStringBuilder(connectionString).DataSource;
    var directory = Path.GetDirectoryName(Path.GetFullPath(dataSource));
    if (!string.IsNullOrEmpty(directory))
    {
        Directory.CreateDirectory(directory);
    }
}

static async Task BootstrapDatabaseAsync(IServiceProvider services, string connectionString)
{
    var dataSource = new SqliteConnectionStringBuilder(connectionString).DataSource;
    var databaseExisted = File.Exists(dataSource);

    using var scope = services.CreateScope();
    var contextFactory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<SecretsDbContext>>();
    await using var db = await contextFactory.CreateDbContextAsync();

    if (!databaseExisted)
    {
        var scriptsDirectory = ResolveScriptsDirectory();
        await RunScriptAsync(db, Path.Combine(scriptsDirectory, "create-schema.sql"));
        await RunScriptAsync(db, Path.Combine(scriptsDirectory, "load-data.sql"));
    }

    await SeedData.EnsureUsersAsync(db);
}

static string ResolveScriptsDirectory()
{
    var candidates = new[]
    {
        "/app/db",
        Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "db", "secrets-vault-mcp"),
        Path.Combine(AppContext.BaseDirectory, "db")
    };

    foreach (var candidate in candidates)
    {
        var fullPath = Path.GetFullPath(candidate);
        if (File.Exists(Path.Combine(fullPath, "create-schema.sql")))
        {
            return fullPath;
        }
    }

    throw new InvalidOperationException(
        $"Could not locate create-schema.sql. Looked under: {string.Join(", ", candidates.Select(Path.GetFullPath))}");
}

static async Task RunScriptAsync(SecretsDbContext db, string scriptPath)
{
    var sql = await File.ReadAllTextAsync(scriptPath);
    await db.Database.ExecuteSqlRawAsync(sql);
}
