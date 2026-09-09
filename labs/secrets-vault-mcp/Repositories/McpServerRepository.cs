using Microsoft.EntityFrameworkCore;
using SecretsMcp.Contracts;
using SecretsMcp.Data;
using SecretsMcp.Data.Encryption;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Repositories;

public sealed class McpServerRepository(
    IDbContextFactory<SecretsDbContext> contextFactory,
    IDbValueCipher cipher) : IMcpServerRepository
{
    private static readonly string[] ValidTransports = ["http", "stdio"];

    public async Task<IReadOnlyList<McpServerDto>> ListAsync(CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        return await db.McpServers
            .AsNoTracking()
            .OrderBy(m => m.Ordinal).ThenBy(m => m.Label)
            .Select(m => ToDto(m))
            .ToListAsync(cancellationToken);
    }

    public async Task<McpServerDto> CreateAsync(CreateMcpServerRequest request, CancellationToken cancellationToken)
    {
        var name = (request.Name ?? "").Trim();
        var label = (request.Label ?? "").Trim();
        var transport = (request.Transport ?? "").Trim().ToLowerInvariant();

        if (name.Length == 0)
        {
            throw new ArgumentException("Name must not be empty.");
        }

        if (label.Length == 0)
        {
            throw new ArgumentException("Label must not be empty.");
        }

        ValidateTransport(transport);

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        if (await db.McpServers.AnyAsync(m => m.Name == name, cancellationToken))
        {
            throw new InvalidOperationException($"An MCP server named '{name}' already exists.");
        }

        var ordinal = request.Ordinal ?? await NextOrdinalAsync(db, cancellationToken);

        var apiKey = string.IsNullOrEmpty(request.ApiKey) ? null : request.ApiKey;

        var server = new McpServer
        {
            McpServerId = Guid.CreateVersion7(),
            Name = name,
            Label = label,
            Transport = transport,
            Url = Normalize(request.Url),
            Command = Normalize(request.Command),
            Args = Normalize(request.Args),
            HeaderName = Normalize(request.HeaderName),
            ApiKey = apiKey,
            Description = Normalize(request.Description),
            Ordinal = ordinal,
            UpdatedAt = DateTime.UtcNow
        };

        cipher.Validate(server);

        await using var tx = await db.Database.BeginTransactionAsync(cancellationToken);
        db.McpServers.Add(server);
        await db.SaveChangesAsync(cancellationToken);

        if (apiKey is not null)
        {
            await cipher.WriteAsync(db, server, cancellationToken);
        }

        await tx.CommitAsync(cancellationToken);

        return ToDto(server) with { HasApiKey = apiKey is not null };
    }

    public async Task<McpServerDto?> UpdateAsync(
        Guid mcpServerId,
        UpdateMcpServerRequest request,
        CancellationToken cancellationToken)
    {
        var label = (request.Label ?? "").Trim();
        var transport = (request.Transport ?? "").Trim().ToLowerInvariant();

        if (label.Length == 0)
        {
            throw new ArgumentException("Label must not be empty.");
        }

        ValidateTransport(transport);

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var server = await db.McpServers.FirstOrDefaultAsync(m => m.McpServerId == mcpServerId, cancellationToken);

        if (server is null)
        {
            return null;
        }

        server.Label = label;
        server.Transport = transport;
        server.Url = Normalize(request.Url);
        server.Command = Normalize(request.Command);
        server.Args = Normalize(request.Args);
        server.HeaderName = Normalize(request.HeaderName);
        server.Description = Normalize(request.Description);
        server.Ordinal = request.Ordinal ?? server.Ordinal;
        server.UpdatedAt = DateTime.UtcNow;

        var setApiKey = !string.IsNullOrEmpty(request.ApiKey);
        var clearApiKey = request.ApiKey is not null && request.ApiKey.Length == 0;

        if (setApiKey)
        {
            server.ApiKey = request.ApiKey;
            cipher.Validate(server);
        }

        await using var tx = await db.Database.BeginTransactionAsync(cancellationToken);
        await db.SaveChangesAsync(cancellationToken);

        if (setApiKey)
        {
            await cipher.WriteAsync(db, server, cancellationToken);
        }
        else if (clearApiKey)
        {
            await db.McpServers
                .Where(m => m.McpServerId == mcpServerId)
                .ExecuteUpdateAsync(setters => setters.SetProperty(m => m.ApiKeyCipher, m => null), cancellationToken);
        }

        await tx.CommitAsync(cancellationToken);

        var hasApiKey = setApiKey ? true : clearApiKey ? false : server.ApiKeyCipher is not null;

        return ToDto(server) with { HasApiKey = hasApiKey };
    }

    public async Task<bool> DeleteAsync(Guid mcpServerId, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var server = await db.McpServers.FirstOrDefaultAsync(m => m.McpServerId == mcpServerId, cancellationToken);

        if (server is null)
        {
            return false;
        }

        db.McpServers.Remove(server);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static void ValidateTransport(string transport)
    {
        if (!ValidTransports.Contains(transport))
        {
            throw new ArgumentException("Transport must be 'http' or 'stdio'.");
        }
    }

    private static async Task<int> NextOrdinalAsync(SecretsDbContext db, CancellationToken cancellationToken)
    {
        var max = await db.McpServers
            .Select(m => (int?)m.Ordinal)
            .MaxAsync(cancellationToken);

        return (max ?? 0) + 1;
    }

    private static string? Normalize(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static McpServerDto ToDto(McpServer m) => new(
        m.McpServerId, m.Name, m.Label, m.Transport, m.Url, m.Command, m.Args, m.HeaderName,
        m.ApiKeyCipher is not null, m.Description, m.Icon, m.IconContentType, m.Ordinal, m.UpdatedAt);
}
