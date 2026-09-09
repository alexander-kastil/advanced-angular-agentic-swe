using System.ComponentModel;

namespace SecretsMcp.Contracts;

public sealed record BoxDto(
    Guid BoxId,
    string Name,
    string Provider,
    long? ServerId,
    string? Ipv4,
    string? Ipv6,
    string? ServerType,
    string? Location,
    string? Hostname,
    string? Role,
    int CredentialCount,
    int AppCount,
    int Ordinal,
    DateTime LastChanged,
    IReadOnlyList<string> Apps);

public sealed record BoxCredentialDto(
    Guid CredentialId,
    string Kind,
    string Label,
    string? Username,
    string? Value,
    string? KeyPath,
    string? Fingerprint,
    string? Comment,
    int Ordinal,
    DateTime LastChanged,
    BoxCredentialFileDto? File);

public sealed record BoxCredentialFileDto(string FileName, string ContentType, long ByteSize, DateTime UploadedAt);

public sealed record BoxCredentialFileContent(byte[] Content, string ContentType, string FileName);

public sealed record BoxAppDto(
    Guid BoxAppId,
    string Name,
    string? Container,
    string? Image,
    string? Slot,
    string? Hostnames,
    int? PublishedPort,
    string? EnvFile,
    int Ordinal);

public sealed record BoxDetailDto(
    Guid BoxId,
    string Name,
    string Provider,
    long? ServerId,
    string? Ipv4,
    string? Ipv6,
    string? ServerType,
    string? Location,
    string? Hostname,
    string? Role,
    string? SshUser,
    string? SshKeyPath,
    string? SshKeyName,
    string? SshCommand,
    string? StackDir,
    string? EdgeDir,
    string? EdgeContainer,
    string? DockerNetwork,
    string? PortBand,
    string? ComposePath,
    string? EnvDir,
    string? Notes,
    int Ordinal,
    DateTime LastChanged,
    IReadOnlyList<BoxCredentialDto> Credentials,
    IReadOnlyList<BoxAppDto> Apps);

public sealed record UpsertBoxRequest(
    [property: Description("The box's display name, unique across the estate, for example integrations-apps.")] string Name,
    [property: Description("Hosting provider. Defaults to hetzner-cloud.")] string? Provider,
    [property: Description("The provider's numeric server id, or omit.")] long? ServerId,
    [property: Description("Public IPv4 address, or omit.")] string? Ipv4,
    [property: Description("Public IPv6 prefix, or omit.")] string? Ipv6,
    [property: Description("Server type/plan, for example cx23, or omit.")] string? ServerType,
    [property: Description("Datacenter location, for example nbg1, or omit.")] string? Location,
    [property: Description("The box's hostname, or omit.")] string? Hostname,
    [property: Description("Free-text role note, or omit.")] string? Role,
    [property: Description("The ssh username, or omit.")] string? SshUser,
    [property: Description("Local path to the ssh private key, or omit.")] string? SshKeyPath,
    [property: Description("Name of the ssh key as registered with the provider, or omit.")] string? SshKeyName,
    [property: Description("Absolute path to the compose stack directory on the box, or omit.")] string? StackDir,
    [property: Description("Absolute path to the shared Caddy edge directory this box uses, or omit.")] string? EdgeDir,
    [property: Description("Name of the container serving the shared Caddy edge, or omit.")] string? EdgeContainer,
    [property: Description("Name of the docker network the stack's containers join, or omit.")] string? DockerNetwork,
    [property: Description("The blue/green port band this box reserves, for example '814x / 1814x', or omit.")] string? PortBand,
    [property: Description("Path to the docker-compose file for the stack, or omit.")] string? ComposePath,
    [property: Description("Directory holding this box's env files, or omit.")] string? EnvDir,
    [property: Description("Free-text notes, or omit.")] string? Notes,
    [property: Description("Position within the estate list. Omit to append on create, or leave unchanged on update.")] int? Ordinal);

public sealed record UpsertBoxCredentialRequest(
    [property: Description("Credential kind: ssh-key, password or api-token.")] string Kind,
    [property: Description("Label for this credential, unique within the box, for example 'root ssh'.")] string Label,
    [property: Description("Username this credential logs in as, or omit.")] string? Username,
    [property: Description("The secret value itself (password, token, or private key text), or omit if the value lives on disk via KeyPath.")] string? Value,
    [property: Description("Local path to the key file, or omit.")] string? KeyPath,
    [property: Description("The key's fingerprint, or omit.")] string? Fingerprint,
    [property: Description("A note about this credential, or omit.")] string? Comment,
    [property: Description("Position within the box's credential list. Omit to append on create, or leave unchanged on update.")] int? Ordinal);

public sealed record UpsertBoxAppRequest(
    [property: Description("The app's name, unique within the box, for example 'api'.")] string Name,
    [property: Description("Name of the running container, or omit.")] string? Container,
    [property: Description("The image reference the container runs, or omit.")] string? Image,
    [property: Description("Deployment slot: blue or green, or omit.")] string? Slot,
    [property: Description("Comma-joined list of hostnames this app answers on, or omit.")] string? Hostnames,
    [property: Description("The host port this app's container publishes, or omit.")] int? PublishedPort,
    [property: Description("Path to this app's env file on the box, or omit.")] string? EnvFile,
    [property: Description("Position within the box's app list. Omit to append on create, or leave unchanged on update.")] int? Ordinal);
