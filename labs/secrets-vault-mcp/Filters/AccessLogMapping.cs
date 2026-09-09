using System.Collections;
using System.Reflection;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace SecretsMcp.Filters;

public static class AccessLogMapping
{
    private static readonly HashSet<string> VaultActions = new(StringComparer.Ordinal)
    {
        "GetFile", "Upload", "GetVersions"
    };

    private static readonly HashSet<string> CredentialActions = new(StringComparer.Ordinal)
    {
        "CreateCredential", "UpdateCredential", "DeleteCredential",
        "UploadCredentialFile", "GetCredentialFile", "DeleteCredentialFile"
    };

    private static readonly string[] IdRouteNamesInPriorityOrder =
    [
        "credentialId", "boxAppId", "settingId", "appId", "boxId",
        "repoId", "categoryId", "environmentId", "mcpServerId", "listId"
    ];

    private static readonly string[] NamePropertiesInPriorityOrder =
        ["Name", "Label", "Topic", "DisplayName", "ModelName", "ServiceKey", "FileName", "FileDownloadName"];

    private static readonly string[] ValueBearingMarkerProperties = ["Password", "Value", "ApiKey", "HasApiKey"];

    public const string CodingAgentUserName = "claude-agent";

    public static string? MapAction(string httpMethod) => httpMethod.ToUpperInvariant() switch
    {
        "GET" or "HEAD" => "Read",
        "POST" or "PUT" or "PATCH" or "DELETE" => "Write",
        _ => null
    };

    public static bool ShouldRecord(bool recordCodingAgentOnly, string userName) =>
        !recordCodingAgentOnly || string.Equals(userName, CodingAgentUserName, StringComparison.Ordinal);

    public static string MapEntityType(string controllerName, string actionName) => controllerName switch
    {
        "Secrets" => VaultActions.Contains(actionName) ? "Vault" : "Secret",
        "Boxes" => CredentialActions.Contains(actionName) ? "Credential" : "Box",
        "Models" => "Model",
        "ProviderKeys" => "Provider",
        "Settings" => "App Value",
        "Apps" => "App",
        "Repos" => "Repo",
        "ReposGitHub" => "Repo",
        "Environments" => "Environment",
        "McpServers" => "MCP Server",
        "Lists" => "List",
        "Categories" => "Category",
        _ => throw new InvalidOperationException($"No access-log entity type mapping for controller '{controllerName}'.")
    };

    public static Guid? ResolveEntityId(
        RouteValueDictionary routeValues,
        IDictionary<string, object?> actionArguments,
        object? resultValue) =>
        ResolveIdFromRoute(routeValues)
            ?? ExtractIdFromArguments(actionArguments)
            ?? ExtractIdFromResult(SingleObjectOrNull(resultValue));

    public static string ResolveEntityName(
        RouteValueDictionary routeValues,
        string entityType,
        IDictionary<string, object?> actionArguments,
        object? resultValue,
        Guid? entityId,
        string routeTemplateFallback) =>
        ResolveNameFromRoute(routeValues, entityType)
            ?? ExtractNameFromArguments(actionArguments)
            ?? NonEmptyString(resultValue as string)
            ?? ExtractNameFromResult(SingleObjectOrNull(resultValue))
            ?? DescribeCollection(resultValue)
            ?? entityId?.ToString()
            ?? routeTemplateFallback;

    public static string ResolveRouteTemplateFallback(string? attributeRouteTemplate, string actionName) =>
        string.IsNullOrWhiteSpace(attributeRouteTemplate) ? actionName : attributeRouteTemplate;

    public static string? ExtractKeysFromRenderedText(string? text) =>
        ExtractKeyList(text) is { Count: > 0 } keys ? string.Join(", ", keys) : null;

    public static string BuildDetails(
        string httpMethod,
        string routePattern,
        int statusCode,
        string action,
        string entityName,
        object? resultValue,
        string? renderedContent,
        IDictionary<string, object?> actionArguments)
    {
        var lines = new List<string> { $"{httpMethod} /{routePattern} -> {statusCode}" };

        if (action == "Read")
        {
            AppendReadDetails(lines, resultValue, renderedContent, entityName);
        }
        else if (httpMethod.Equals("DELETE", StringComparison.OrdinalIgnoreCase))
        {
            lines.Add(entityName);
        }
        else
        {
            AppendWriteDetails(lines, actionArguments, entityName);
        }

        return string.Join("\n", lines);
    }

    public static string ResolveUserName(ClaimsPrincipal user)
    {
        var preferredUsername = user.FindFirst("preferred_username")?.Value;
        if (!string.IsNullOrWhiteSpace(preferredUsername))
        {
            return preferredUsername;
        }

        var name = user.FindFirst("name")?.Value;
        if (!string.IsNullOrWhiteSpace(name))
        {
            return name;
        }

        var claimsName = user.FindFirst(ClaimTypes.Name)?.Value;
        return string.IsNullOrWhiteSpace(claimsName) ? "anonymous" : claimsName;
    }

    public static string ResolveIpAddress(string? forwardedFor, string? remoteIpAddress)
    {
        if (!string.IsNullOrWhiteSpace(forwardedFor))
        {
            var first = forwardedFor.Split(',')[0].Trim();
            if (first.Length > 0)
            {
                return first;
            }
        }

        return string.IsNullOrWhiteSpace(remoteIpAddress) ? "unknown" : remoteIpAddress;
    }

    private static Guid? ResolveIdFromRoute(RouteValueDictionary routeValues)
    {
        foreach (var name in IdRouteNamesInPriorityOrder)
        {
            if (routeValues.TryGetValue(name, out var raw) && Guid.TryParse(raw?.ToString(), out var fromRoute))
            {
                return fromRoute;
            }
        }

        return null;
    }

    private static string? ResolveNameFromRoute(RouteValueDictionary routeValues, string entityType)
    {
        if (routeValues.TryGetValue("name", out var name) && name is string nameText && nameText.Length > 0)
        {
            return nameText;
        }

        if (entityType == "Model" && routeValues.TryGetValue("modelName", out var modelName) && modelName is string modelNameText)
        {
            return modelNameText;
        }

        if (entityType == "Provider" && routeValues.TryGetValue("serviceKey", out var serviceKey) && serviceKey is string serviceKeyText)
        {
            return serviceKeyText;
        }

        return null;
    }

    private static Guid? ExtractIdFromArguments(IDictionary<string, object?> actionArguments)
    {
        foreach (var value in actionArguments.Values)
        {
            if (value is Guid guid)
            {
                return guid;
            }
        }

        foreach (var value in actionArguments.Values)
        {
            var id = ExtractIdFromResult(IsComplexArgument(value) ? value : null);
            if (id is not null)
            {
                return id;
            }
        }

        return null;
    }

    private static string? ExtractNameFromArguments(IDictionary<string, object?> actionArguments)
    {
        if (actionArguments.TryGetValue("name", out var nameArgument) && nameArgument is string nameText && nameText.Length > 0)
        {
            return nameText;
        }

        foreach (var value in actionArguments.Values)
        {
            if (value is IFormFile formFile && formFile.FileName.Length > 0)
            {
                return formFile.FileName;
            }
        }

        foreach (var value in actionArguments.Values)
        {
            var name = ExtractNameFromResult(IsComplexArgument(value) ? value : null);
            if (name is not null)
            {
                return name;
            }
        }

        return null;
    }

    private static bool IsComplexArgument(object? value) =>
        value is not null && value is not string && value is not Guid && value is not CancellationToken
        && value is not IFormFile && !value.GetType().IsPrimitive;

    private static object? SingleObjectOrNull(object? value) =>
        value is null || value is string || value is IEnumerable ? null : value;

    private static string? NonEmptyString(string? value) => string.IsNullOrEmpty(value) ? null : value;

    private static string? DescribeCollection(object? value)
    {
        if (value is null || value is string || value is not IEnumerable enumerable)
        {
            return null;
        }

        var items = enumerable.Cast<object?>().ToList();
        if (items.Count == 0)
        {
            return "(none)";
        }

        var descriptors = new List<string>(items.Count);
        foreach (var item in items)
        {
            var name = ExtractNameFromResult(item);
            if (name is not null)
            {
                descriptors.Add(name);
                continue;
            }

            var id = ExtractIdFromResult(item);
            if (id is not null)
            {
                descriptors.Add(id.Value.ToString());
                continue;
            }

            return $"(all, {items.Count})";
        }

        return string.Join(", ", descriptors);
    }

    private static Guid? ExtractIdFromResult(object? value)
    {
        if (value is null)
        {
            return null;
        }

        foreach (var property in value.GetType().GetProperties())
        {
            if (property.PropertyType == typeof(Guid) && property.GetValue(value) is Guid guid)
            {
                return guid;
            }

            if (property.PropertyType == typeof(Guid?) && property.GetValue(value) is Guid nullableGuid)
            {
                return nullableGuid;
            }
        }

        return null;
    }

    private static string? ExtractOwnName(object? value)
    {
        if (value is null)
        {
            return null;
        }

        var type = value.GetType();
        foreach (var propertyName in NamePropertiesInPriorityOrder)
        {
            if (type.GetProperty(propertyName)?.GetValue(value) is string text && text.Length > 0)
            {
                return text;
            }
        }

        return null;
    }

    private static string? ExtractNameFromResult(object? value)
    {
        if (value is null)
        {
            return null;
        }

        var ownName = ExtractOwnName(value);

        var leafProperty = FindLeafCollectionProperty(value.GetType());
        if (leafProperty?.GetValue(value) is IEnumerable leafItems)
        {
            var descriptors = leafItems.Cast<object?>()
                .Select(item => DescribeLeafItem(item, ownName))
                .Where(descriptor => descriptor is not null)
                .Select(descriptor => descriptor!)
                .ToList();

            if (descriptors.Count > 0)
            {
                return string.Join(", ", descriptors);
            }
        }

        return ownName;
    }

    private static string? DescribeLeafItem(object? item, string? parentName)
    {
        var leafName = ExtractOwnName(item);
        if (leafName is not null)
        {
            return parentName is null ? leafName : $"{parentName} / {leafName}";
        }

        var leafId = ExtractIdFromResult(item);
        if (leafId is not null)
        {
            return parentName is null ? leafId.Value.ToString() : $"{parentName} / {leafId}";
        }

        return null;
    }

    private static PropertyInfo? FindLeafCollectionProperty(Type type)
    {
        foreach (var property in type.GetProperties())
        {
            if (property.PropertyType == typeof(string))
            {
                continue;
            }

            var elementType = GetEnumerableElementType(property.PropertyType);
            if (elementType is null || elementType == typeof(string) || elementType == typeof(Guid) || elementType.IsPrimitive)
            {
                continue;
            }

            if (ValueBearingMarkerProperties.Any(marker => elementType.GetProperty(marker) is not null))
            {
                return property;
            }
        }

        return null;
    }

    private static Type? GetEnumerableElementType(Type type)
    {
        if (type.IsArray)
        {
            return type.GetElementType();
        }

        foreach (var candidate in type.GetInterfaces().Prepend(type))
        {
            if (candidate.IsGenericType && candidate.GetGenericTypeDefinition() == typeof(IEnumerable<>))
            {
                return candidate.GetGenericArguments()[0];
            }
        }

        return null;
    }

    private static List<string>? ExtractKeyList(string? text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return null;
        }

        var keys = text
            .Split('\n')
            .Select(line => line.TrimEnd('\r').Trim())
            .Where(line => line.Length > 0 && line[0] != '#')
            .Select(line => line.IndexOf('=') is var separator && separator > 0 ? line[..separator].Trim() : null)
            .Where(key => !string.IsNullOrEmpty(key))
            .Select(key => key!)
            .Distinct()
            .ToList();

        return keys.Count == 0 ? null : keys;
    }

    private static void AppendReadDetails(List<string> lines, object? resultValue, string? renderedContent, string entityName)
    {
        var keys = ExtractKeyList(renderedContent);
        if (keys is not null)
        {
            lines.AddRange(keys);
            return;
        }

        if (resultValue is IEnumerable enumerable && resultValue is not string)
        {
            var items = enumerable.Cast<object?>().ToList();
            lines.Add($"{items.Count} record{(items.Count == 1 ? "" : "s")} returned");

            foreach (var item in items)
            {
                if (item is null)
                {
                    continue;
                }

                lines.Add("  " + DescribeRecordLine(item));
                foreach (var leafLine in DescribeLeafLines(item, "    "))
                {
                    lines.Add(leafLine);
                }
            }

            return;
        }

        if (resultValue is not null)
        {
            lines.Add(DescribeRecordLine(resultValue));
            foreach (var leafLine in DescribeLeafLines(resultValue, "  "))
            {
                lines.Add(leafLine);
            }

            return;
        }

        lines.Add(entityName);
    }

    private static string DescribeRecordLine(object item)
    {
        var name = ExtractOwnName(item) ?? "(unnamed)";

        var counts = item.GetType().GetProperties()
            .Where(p => p.PropertyType == typeof(int) && p.Name.EndsWith("Count", StringComparison.Ordinal) && p.Name.Length > 5)
            .Select(p => $"{Pluralize(p.Name[..^5])}: {p.GetValue(item)}")
            .ToList();

        return counts.Count == 0 ? name : $"{name}   {string.Join("   ", counts)}";
    }

    private static string Pluralize(string singular) =>
        singular.Length == 0 ? singular : char.ToLowerInvariant(singular[0]) + singular[1..] + "s";

    private static IEnumerable<string> DescribeLeafLines(object item, string indent)
    {
        var leafProperty = FindLeafCollectionProperty(item.GetType());
        if (leafProperty?.GetValue(item) is not IEnumerable leafItems)
        {
            yield break;
        }

        var parentName = ExtractOwnName(item);

        foreach (var leaf in leafItems)
        {
            var descriptor = DescribeLeafItem(leaf, parentName);
            if (descriptor is null)
            {
                continue;
            }

            var kind = leaf?.GetType().GetProperty("Kind")?.GetValue(leaf) as string;
            yield return kind is { Length: > 0 } ? $"{indent}{descriptor}   ({kind})" : $"{indent}{descriptor}";
        }
    }

    private static void AppendWriteDetails(List<string> lines, IDictionary<string, object?> actionArguments, string entityName)
    {
        var dto = actionArguments.Values.FirstOrDefault(IsComplexArgument);
        if (dto is null)
        {
            lines.Add(entityName);
            return;
        }

        var identityPropertyName = IdentityPropertyName(dto);
        var identity = identityPropertyName is not null
            ? dto.GetType().GetProperty(identityPropertyName)!.GetValue(dto) as string
            : null;
        lines.Add(identity ?? entityName);

        foreach (var property in dto.GetType().GetProperties())
        {
            if (property.Name == identityPropertyName)
            {
                continue;
            }

            var value = property.GetValue(dto);
            if (value is null)
            {
                continue;
            }

            lines.Add($"  {property.Name}");
        }
    }

    private static string? IdentityPropertyName(object value)
    {
        var type = value.GetType();
        foreach (var propertyName in NamePropertiesInPriorityOrder)
        {
            if (type.GetProperty(propertyName)?.GetValue(value) is string text && text.Length > 0)
            {
                return propertyName;
            }
        }

        return null;
    }

}
