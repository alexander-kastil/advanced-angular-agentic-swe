namespace SecretsMcp.Data.Entities;

public sealed class Repo
{
    public Guid RepoId { get; set; }
    public string Name { get; set; } = "";
    public string? LocalPath { get; set; }
    public string? RemoteUrl { get; set; }
    public DateTime LastChanged { get; set; }
    public ICollection<App> Apps { get; set; } = [];
}
