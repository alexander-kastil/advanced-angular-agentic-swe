namespace SecretsMcp.Data.Entities;

public sealed class App
{
    public Guid AppId { get; set; }
    public Guid RepoId { get; set; }
    public string Name { get; set; } = "";
    public string Kind { get; set; } = AppKind.App;
    public Guid? BoxId { get; set; }
    public int Ordinal { get; set; }
    public DateTime LastChanged { get; set; }
    public Repo Repo { get; set; } = null!;
    public Box? Box { get; set; }
    public AppRegistration? Registration { get; set; }
    public ICollection<AppTarget> Targets { get; set; } = [];
    public ICollection<Setting> Settings { get; set; } = [];
}
