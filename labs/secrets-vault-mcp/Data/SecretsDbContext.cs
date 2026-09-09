using System.Reflection;
using Microsoft.EntityFrameworkCore;
using SecretsMcp.Data.Encryption;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data;

public sealed class SecretsDbContext(DbContextOptions<SecretsDbContext> options) : DbContext(options)
{
    public DbSet<SecretList> SecretLists => Set<SecretList>();
    public DbSet<Secret> Secrets => Set<Secret>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<SecretCategory> SecretCategories => Set<SecretCategory>();
    public DbSet<VaultFile> VaultFiles => Set<VaultFile>();
    public DbSet<Repo> Repos => Set<Repo>();
    public DbSet<App> Apps => Set<App>();
    public DbSet<DeploymentEnvironment> Environments => Set<DeploymentEnvironment>();
    public DbSet<AppTarget> AppTargets => Set<AppTarget>();
    public DbSet<Setting> Settings => Set<Setting>();
    public DbSet<SettingValue> SettingValues => Set<SettingValue>();
    public DbSet<Model> Models => Set<Model>();
    public DbSet<ProviderKey> ProviderKeys => Set<ProviderKey>();
    public DbSet<Box> Boxes => Set<Box>();
    public DbSet<BoxCredential> BoxCredentials => Set<BoxCredential>();
    public DbSet<BoxApp> BoxApps => Set<BoxApp>();
    public DbSet<BoxCredentialFile> BoxCredentialFiles => Set<BoxCredentialFile>();
    public DbSet<AppRegistration> AppRegistrations => Set<AppRegistration>();
    public DbSet<AppRegistrationManifest> AppRegistrationManifests => Set<AppRegistrationManifest>();
    public DbSet<McpServer> McpServers => Set<McpServer>();
    public DbSet<GitHubAuth> GitHubAuth => Set<GitHubAuth>();
    public DbSet<AccessLogEntry> AccessLog => Set<AccessLogEntry>();
    public DbSet<AccessLogSettings> AccessLogSettings => Set<AccessLogSettings>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();

    public static string? DecryptDbValue(byte[]? cipher, string passphrase) =>
        throw new NotSupportedException("DecryptDbValue is evaluated by the SQLite connection's registered scalar function only.");

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<Guid>().HaveConversion<string>();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        modelBuilder.ApplyDbEncryption();

        modelBuilder
            .HasDbFunction(typeof(SecretsDbContext)
                .GetMethod(nameof(DecryptDbValue), [typeof(byte[]), typeof(string)])!)
            .HasName("DecryptDbValue");
    }
}
