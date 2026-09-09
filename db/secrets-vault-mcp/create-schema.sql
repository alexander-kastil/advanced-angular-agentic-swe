-- secrets-vault-mcp schema, complete and standalone, SQLite dialect. Creates the database
-- objects as they stand today. Safe to run against an empty database: every object uses
-- IF NOT EXISTS, and nothing is dropped. Applied once by the app on first startup, when the
-- database file is absent.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS SecretLists
(
    ListId      TEXT NOT NULL PRIMARY KEY,
    Name        TEXT NOT NULL,
    Description TEXT NULL,
    Type        INTEGER NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX IF NOT EXISTS UX_SecretLists_Name ON SecretLists (Name);

CREATE TABLE IF NOT EXISTS Categories
(
    CategoryId TEXT NOT NULL PRIMARY KEY,
    Topic      TEXT NOT NULL,
    Color      TEXT NOT NULL,
    ListId     TEXT NOT NULL REFERENCES SecretLists (ListId)
);

CREATE UNIQUE INDEX IF NOT EXISTS UX_Categories_ListId_Topic ON Categories (ListId, Topic);

CREATE TABLE IF NOT EXISTS Secrets
(
    SecretId    TEXT NOT NULL PRIMARY KEY,
    Name        TEXT NOT NULL,
    Url         TEXT NULL,
    User        TEXT NULL,
    Comment     TEXT NULL,
    Mfa         INTEGER NOT NULL DEFAULT 0,
    Version     INTEGER NOT NULL DEFAULT 1 CHECK (Version >= 1),
    LastChanged TEXT NOT NULL,
    Password    BLOB NULL,
    ListId      TEXT NOT NULL REFERENCES SecretLists (ListId)
);

CREATE UNIQUE INDEX IF NOT EXISTS UX_Secrets_ListId_Name_Version ON Secrets (ListId, Name, Version);

CREATE TABLE IF NOT EXISTS SecretCategories
(
    SecretId   TEXT NOT NULL REFERENCES Secrets (SecretId) ON DELETE CASCADE,
    CategoryId TEXT NOT NULL REFERENCES Categories (CategoryId),
    PRIMARY KEY (SecretId, CategoryId)
);

CREATE TABLE IF NOT EXISTS VaultFiles
(
    SecretId    TEXT NOT NULL PRIMARY KEY REFERENCES Secrets (SecretId) ON DELETE CASCADE,
    FileName    TEXT NOT NULL,
    ContentType TEXT NOT NULL,
    ByteSize    INTEGER NOT NULL,
    Content     BLOB NOT NULL,
    UploadedAt  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Repos
(
    RepoId      TEXT NOT NULL PRIMARY KEY,
    Name        TEXT NOT NULL,
    LocalPath   TEXT NULL,
    RemoteUrl   TEXT NULL,
    LastChanged TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Environments
(
    EnvironmentId TEXT NOT NULL PRIMARY KEY,
    Name          TEXT NOT NULL,
    Type          TEXT NOT NULL CHECK (Type IN ('dev', 'blue', 'green')),
    Ordinal       INTEGER NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS UX_Environments_Name ON Environments (Name);
CREATE UNIQUE INDEX IF NOT EXISTS UX_Environments_Type ON Environments (Type);

CREATE TABLE IF NOT EXISTS Boxes
(
    BoxId         TEXT NOT NULL PRIMARY KEY,
    Name          TEXT NOT NULL,
    Provider      TEXT NOT NULL DEFAULT 'hetzner-cloud',
    ServerId      INTEGER NULL,
    Ipv4          TEXT NULL,
    Ipv6          TEXT NULL,
    ServerType    TEXT NULL,
    Location      TEXT NULL,
    Hostname      TEXT NULL,
    Role          TEXT NULL,
    SshUser       TEXT NULL,
    SshKeyPath    TEXT NULL,
    SshKeyName    TEXT NULL,
    StackDir      TEXT NULL,
    EdgeDir       TEXT NULL,
    EdgeContainer TEXT NULL,
    DockerNetwork TEXT NULL,
    PortBand      TEXT NULL,
    ComposePath   TEXT NULL,
    EnvDir        TEXT NULL,
    Notes         TEXT NULL,
    Ordinal       INTEGER NOT NULL DEFAULT 0,
    LastChanged   TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS UX_Boxes_Name ON Boxes (Name);

CREATE TABLE IF NOT EXISTS Apps
(
    AppId       TEXT NOT NULL PRIMARY KEY,
    RepoId      TEXT NOT NULL REFERENCES Repos (RepoId) ON DELETE CASCADE,
    Name        TEXT NOT NULL,
    Kind        TEXT NOT NULL CHECK (Kind IN ('api', 'ui', 'mcp', 'cli', 'agent', 'site', 'team', 'app')),
    BoxId       TEXT NULL REFERENCES Boxes (BoxId) ON DELETE SET NULL,
    Ordinal     INTEGER NOT NULL DEFAULT 0,
    LastChanged TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS UX_Apps_RepoId_Name ON Apps (RepoId, Name);
CREATE INDEX IF NOT EXISTS IX_Apps_BoxId ON Apps (BoxId);

CREATE TABLE IF NOT EXISTS AppTargets
(
    TargetId      TEXT NOT NULL PRIMARY KEY,
    AppId         TEXT NOT NULL REFERENCES Apps (AppId),
    EnvironmentId TEXT NOT NULL REFERENCES Environments (EnvironmentId),
    FilePath      TEXT NOT NULL,
    Ordinal       INTEGER NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS UX_AppTargets_AppId_EnvironmentId_FilePath ON AppTargets (AppId, EnvironmentId, FilePath);

CREATE TABLE IF NOT EXISTS Settings
(
    SettingId   TEXT NOT NULL PRIMARY KEY,
    AppId       TEXT NOT NULL REFERENCES Apps (AppId) ON DELETE CASCADE,
    Name        TEXT NOT NULL,
    IsSecret    INTEGER NOT NULL DEFAULT 1,
    Comment     TEXT NULL,
    Ordinal     INTEGER NOT NULL DEFAULT 0,
    LastChanged TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS UX_Settings_AppId_Name ON Settings (AppId, Name);

CREATE TABLE IF NOT EXISTS SettingValues
(
    SettingId     TEXT NOT NULL REFERENCES Settings (SettingId) ON DELETE CASCADE,
    EnvironmentId TEXT NOT NULL REFERENCES Environments (EnvironmentId),
    TargetId      TEXT NULL REFERENCES AppTargets (TargetId) ON DELETE SET NULL,
    KeyPath       TEXT NOT NULL,
    Value         TEXT NULL,
    IsPlaceholder INTEGER NOT NULL DEFAULT 0,
    SecretListId  TEXT NULL REFERENCES SecretLists (ListId),
    SecretName    TEXT NULL,
    LastChanged   TEXT NOT NULL,
    PRIMARY KEY (SettingId, EnvironmentId),
    CHECK ((SecretListId IS NULL AND SecretName IS NULL) OR (SecretListId IS NOT NULL AND SecretName IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS Models
(
    Provider                 TEXT NOT NULL,
    ModelName                TEXT NOT NULL,
    Name                     TEXT NOT NULL,
    SupportsVision           INTEGER NOT NULL DEFAULT 0,
    Temperature              TEXT NOT NULL DEFAULT '0.2',
    MaxTokens                INTEGER NULL,
    TopP                     TEXT NULL,
    IsDefault                INTEGER NOT NULL DEFAULT 0,
    Icon                     BLOB NULL,
    IconContentType          TEXT NULL,
    Description              TEXT NULL,
    TaskType                 TEXT NULL,
    ContextLength            INTEGER NULL,
    Quantization             TEXT NULL,
    ServingTier              TEXT NULL,
    PriceCachedInPerMillion  TEXT NULL,
    PriceInPerMillion        TEXT NULL,
    PriceOutPerMillion       TEXT NULL,
    PricePerUnit             TEXT NULL,
    PriceUnit                TEXT NULL,
    PRIMARY KEY (Provider, ModelName)
);

CREATE TABLE IF NOT EXISTS ProviderKeys
(
    Provider   TEXT NOT NULL,
    ServiceKey TEXT NOT NULL,
    Label      TEXT NOT NULL,
    BaseUrl    TEXT NULL,
    Version    INTEGER NOT NULL DEFAULT 1,
    UpdatedAt  TEXT NOT NULL,
    Value      TEXT NULL,
    PRIMARY KEY (Provider, ServiceKey)
);

CREATE TABLE IF NOT EXISTS BoxCredentials
(
    CredentialId TEXT NOT NULL PRIMARY KEY,
    BoxId        TEXT NOT NULL REFERENCES Boxes (BoxId) ON DELETE CASCADE,
    Kind         TEXT NOT NULL CHECK (Kind IN ('ssh-key', 'password', 'api-token')),
    Label        TEXT NOT NULL,
    Username     TEXT NULL,
    Value        TEXT NULL,
    KeyPath      TEXT NULL,
    Fingerprint  TEXT NULL,
    Comment      TEXT NULL,
    Ordinal      INTEGER NOT NULL DEFAULT 0,
    LastChanged  TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS UX_BoxCredentials_BoxId_Label ON BoxCredentials (BoxId, Label);

CREATE TABLE IF NOT EXISTS BoxApps
(
    BoxAppId      TEXT NOT NULL PRIMARY KEY,
    BoxId         TEXT NOT NULL REFERENCES Boxes (BoxId) ON DELETE CASCADE,
    Name          TEXT NOT NULL,
    Container     TEXT NULL,
    Image         TEXT NULL,
    Slot          TEXT NULL CHECK (Slot IS NULL OR Slot IN ('blue', 'green')),
    Hostnames     TEXT NULL,
    PublishedPort INTEGER NULL,
    EnvFile       TEXT NULL,
    Ordinal       INTEGER NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS UX_BoxApps_BoxId_Name ON BoxApps (BoxId, Name);

CREATE TABLE IF NOT EXISTS BoxCredentialFiles
(
    CredentialId TEXT NOT NULL PRIMARY KEY REFERENCES BoxCredentials (CredentialId) ON DELETE CASCADE,
    FileName     TEXT NOT NULL,
    ContentType  TEXT NOT NULL,
    ByteSize     INTEGER NOT NULL,
    Content      BLOB NOT NULL,
    UploadedAt   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS AppRegistrations
(
    AppId          TEXT NOT NULL PRIMARY KEY REFERENCES Apps (AppId) ON DELETE CASCADE,
    DisplayName    TEXT NOT NULL,
    ClientId       TEXT NULL,
    TenantId       TEXT NULL,
    ObjectId       TEXT NULL,
    SignInAudience TEXT NULL,
    Notes          TEXT NULL,
    LastChanged    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS AppRegistrationManifests
(
    AppId       TEXT NOT NULL PRIMARY KEY REFERENCES AppRegistrations (AppId) ON DELETE CASCADE,
    FileName    TEXT NOT NULL,
    ContentType TEXT NOT NULL,
    ByteSize    INTEGER NOT NULL,
    Content     BLOB NOT NULL,
    UploadedAt  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS McpServers
(
    McpServerId     TEXT NOT NULL PRIMARY KEY,
    Name            TEXT NOT NULL,
    Label           TEXT NOT NULL,
    Transport       TEXT NOT NULL,
    Url             TEXT NULL,
    Command         TEXT NULL,
    Args            TEXT NULL,
    HeaderName      TEXT NULL,
    ApiKey          BLOB NULL,
    Description     TEXT NULL,
    Icon            BLOB NULL,
    IconContentType TEXT NULL,
    Ordinal         INTEGER NOT NULL DEFAULT 0,
    UpdatedAt       TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS UX_McpServers_Name ON McpServers (Name);

CREATE TABLE IF NOT EXISTS GitHubAuth
(
    Id         TEXT NOT NULL PRIMARY KEY,
    Token      BLOB NULL,
    Login      TEXT NULL,
    UpdatedUtc TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS AccessLog
(
    AccessLogId TEXT NOT NULL PRIMARY KEY,
    OccurredAt  TEXT NOT NULL,
    Action      TEXT NOT NULL,
    EntityType  TEXT NOT NULL,
    EntityName  TEXT NULL,
    EntityId    TEXT NULL,
    UserName    TEXT NOT NULL,
    IpAddress   TEXT NOT NULL,
    Details     TEXT NULL
);

CREATE INDEX IF NOT EXISTS IX_AccessLog_OccurredAt ON AccessLog (OccurredAt DESC);

CREATE TABLE IF NOT EXISTS AccessLogSettings
(
    Id                    TEXT NOT NULL PRIMARY KEY,
    RecordCodingAgentOnly INTEGER NOT NULL DEFAULT 1,
    LastChanged           TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Roles
(
    RoleId TEXT NOT NULL PRIMARY KEY,
    Name   TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS UX_Roles_Name ON Roles (Name);

CREATE TABLE IF NOT EXISTS Users
(
    UserId       TEXT NOT NULL PRIMARY KEY,
    Name         TEXT NOT NULL,
    PasswordHash TEXT NOT NULL,
    IsActive     INTEGER NOT NULL DEFAULT 1,
    CreatedAt    TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS UX_Users_Name ON Users (Name);

CREATE TABLE IF NOT EXISTS UserRoles
(
    UserId TEXT NOT NULL REFERENCES Users (UserId) ON DELETE CASCADE,
    RoleId TEXT NOT NULL REFERENCES Roles (RoleId) ON DELETE CASCADE,
    PRIMARY KEY (UserId, RoleId)
);
