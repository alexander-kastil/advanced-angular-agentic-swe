namespace SecretsMcp.Data.Entities;

public sealed class BoxCredentialFile
{
    public Guid CredentialId { get; set; }
    public string FileName { get; set; } = "";
    public string ContentType { get; set; } = "";
    public long ByteSize { get; set; }
    public byte[] Content { get; set; } = [];
    public DateTime UploadedAt { get; set; }
}
