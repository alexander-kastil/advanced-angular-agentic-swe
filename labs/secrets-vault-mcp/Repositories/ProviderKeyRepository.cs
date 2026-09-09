using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SecretsMcp.Contracts;
using SecretsMcp.Data;
using SecretsMcp.Data.Encryption;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Repositories;

public sealed class ProviderKeyRepository(
    IDbContextFactory<SecretsDbContext> contextFactory) : IProviderKeyRepository
{
    public async Task<IReadOnlyList<ProviderKeyDto>> ListAsync(CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var rows = await db.ProviderKeys
            .AsNoTracking()
            .OrderBy(k => k.Provider).ThenBy(k => k.ServiceKey)
            .Select(Projection)
            .ToListAsync(cancellationToken);

        return rows.Select(ToDto).ToList();
    }

    public async Task<ProviderKeyDto> SetAsync(
        string provider,
        string serviceKey,
        SetProviderKeyRequest request,
        CancellationToken cancellationToken)
    {
        var key = (request.Key ?? "").Trim();
        if (key.Length == 0)
        {
            throw new ArgumentException("The credential must not be empty.");
        }

        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var existing = await db.ProviderKeys.FirstOrDefaultAsync(
            k => k.Provider == provider && k.ServiceKey == serviceKey, cancellationToken);

        var label = request.Label?.Trim();
        var baseUrl = request.BaseUrl?.Trim();

        if (existing is null)
        {
            if (string.IsNullOrEmpty(label))
            {
                throw new ArgumentException("Label is required when creating a new provider key.");
            }

            var created = new ProviderKey
            {
                Provider = provider,
                ServiceKey = serviceKey,
                Label = label,
                Value = key,
                BaseUrl = string.IsNullOrEmpty(baseUrl) ? null : baseUrl,
                Version = 1,
                UpdatedAt = DateTime.UtcNow
            };

            db.ProviderKeys.Add(created);
            await db.SaveChangesAsync(cancellationToken);

            return new ProviderKeyDto(
                created.Provider, created.ServiceKey, created.Label, created.BaseUrl,
                Last4(key), created.UpdatedAt, created.Version);
        }

        if (!string.IsNullOrEmpty(label))
        {
            existing.Label = label;
        }

        if (!string.IsNullOrEmpty(baseUrl))
        {
            existing.BaseUrl = baseUrl;
        }

        existing.Value = key;
        existing.Version += 1;
        existing.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(cancellationToken);

        return new ProviderKeyDto(
            existing.Provider, existing.ServiceKey, existing.Label, existing.BaseUrl,
            Last4(key), existing.UpdatedAt, existing.Version);
    }

    public async Task<string?> ResolveDecryptedAsync(string provider, string serviceKey, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        var row = await db.ProviderKeys
            .AsNoTracking()
            .Where(k => k.Provider == provider && k.ServiceKey == serviceKey)
            .Select(Projection)
            .FirstOrDefaultAsync(cancellationToken);

        return row?.Key;
    }

    public async Task<string?> ResolveBaseUrlAsync(string provider, string serviceKey, CancellationToken cancellationToken)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);

        return await db.ProviderKeys
            .AsNoTracking()
            .Where(k => k.Provider == provider && k.ServiceKey == serviceKey)
            .Select(k => k.BaseUrl)
            .FirstOrDefaultAsync(cancellationToken);
    }

    private sealed record ProviderKeyRow(
        string Provider, string ServiceKey, string Label, string? BaseUrl,
        string? Key, DateTime UpdatedAt, int Version);

    private static readonly Expression<Func<ProviderKey, ProviderKeyRow>> Projection = k => new ProviderKeyRow(
        k.Provider, k.ServiceKey, k.Label, k.BaseUrl, k.Value, k.UpdatedAt, k.Version);

    private static ProviderKeyDto ToDto(ProviderKeyRow r) => new(
        r.Provider, r.ServiceKey, r.Label, r.BaseUrl, Last4(r.Key), r.UpdatedAt, r.Version);

    private static string? Last4(string? key) =>
        string.IsNullOrEmpty(key) ? null : key[^Math.Min(4, key.Length)..];
}
