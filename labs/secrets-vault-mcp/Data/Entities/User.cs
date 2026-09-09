namespace SecretsMcp.Data.Entities;

public sealed class User
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public ICollection<UserRole> UserRoles { get; set; } = [];
}
