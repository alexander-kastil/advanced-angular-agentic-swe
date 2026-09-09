using Microsoft.EntityFrameworkCore;
using SecretsMcp.Auth;
using SecretsMcp.Data.Entities;

namespace SecretsMcp.Data;

public static class SeedData
{
    public static async Task EnsureUsersAsync(SecretsDbContext db, CancellationToken cancellationToken = default)
    {
        var ownerRole = await EnsureRoleAsync(db, AuthorizationPolicies.OwnerRole, cancellationToken);
        var customerRole = await EnsureRoleAsync(db, AuthorizationPolicies.CustomerRole, cancellationToken);

        await EnsureUserAsync(db, "owner", "Owner#Vault2026!", ownerRole.RoleId, cancellationToken);
        await EnsureUserAsync(db, "customer", "Customer#Vault2026!", customerRole.RoleId, cancellationToken);
    }

    private static async Task<Role> EnsureRoleAsync(SecretsDbContext db, string name, CancellationToken cancellationToken)
    {
        var role = await db.Roles.FirstOrDefaultAsync(r => r.Name == name, cancellationToken);
        if (role is not null) return role;

        role = new Role { RoleId = Guid.CreateVersion7(), Name = name };
        db.Roles.Add(role);
        await db.SaveChangesAsync(cancellationToken);
        return role;
    }

    private static async Task EnsureUserAsync(
        SecretsDbContext db, string name, string password, Guid roleId, CancellationToken cancellationToken)
    {
        var user = await db.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Name == name, cancellationToken);

        if (user is null)
        {
            user = new User
            {
                UserId = Guid.CreateVersion7(),
                Name = name,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            db.Users.Add(user);
            await db.SaveChangesAsync(cancellationToken);
        }

        if (!user.UserRoles.Any(ur => ur.RoleId == roleId))
        {
            db.UserRoles.Add(new UserRole { UserId = user.UserId, RoleId = roleId });
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
