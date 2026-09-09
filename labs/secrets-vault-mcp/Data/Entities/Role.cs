namespace SecretsMcp.Data.Entities;

public sealed class Role
{
    public Guid RoleId { get; set; }
    public string Name { get; set; } = "";
    public ICollection<UserRole> UserRoles { get; set; } = [];
}
