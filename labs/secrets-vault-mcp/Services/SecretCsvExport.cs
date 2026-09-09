using System.Globalization;
using System.Text;
using SecretsMcp.Contracts;

namespace SecretsMcp.Services;

public static class SecretCsvExport
{
    public const string Header = "List;Name;Url;User;Password;Comment;Mfa;Categories;Version;LastChanged";

    public static byte[] Build(
        IReadOnlyList<SecretDto> secrets,
        IReadOnlyDictionary<Guid, string> categoryNames,
        IReadOnlyDictionary<Guid, string> listNames)
    {
        var csv = new StringBuilder();
        csv.Append(Header).Append("\r\n");

        foreach (var secret in secrets)
        {
            var categories = string.Join(",", secret.CategoryIds.Select(id => categoryNames.GetValueOrDefault(id, "")));

            csv.Append(Field(listNames.GetValueOrDefault(secret.ListId, ""))).Append(';')
                .Append(Field(secret.Name)).Append(';')
                .Append(Field(secret.Url)).Append(';')
                .Append(Field(secret.User)).Append(';')
                .Append(Field(secret.Password)).Append(';')
                .Append(Field(secret.Comment)).Append(';')
                .Append(Field(secret.Mfa ? "true" : "false")).Append(';')
                .Append(Field(categories)).Append(';')
                .Append(Field(secret.Version.ToString(CultureInfo.InvariantCulture))).Append(';')
                .Append(Field(secret.LastChanged.ToString("yyyy-MM-dd'T'HH:mm:ss'Z'", CultureInfo.InvariantCulture)))
                .Append("\r\n");
        }

        var preamble = Encoding.UTF8.GetPreamble();
        var body = Encoding.UTF8.GetBytes(csv.ToString());
        var result = new byte[preamble.Length + body.Length];
        preamble.CopyTo(result, 0);
        body.CopyTo(result, preamble.Length);
        return result;
    }

    private static string Field(string? value)
    {
        value ??= "";
        return $"\"{value.Replace("\"", "\"\"")}\"";
    }
}
