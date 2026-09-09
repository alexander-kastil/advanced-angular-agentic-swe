using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Routing;
using SecretsMcp.Data.Entities;
using SecretsMcp.Repositories;
using SecretsMcp.Services;

namespace SecretsMcp.Filters;

public sealed class AccessLogFilter(IAccessLogRepository repository, IAccessLogSettingsCache settingsCache) : IAsyncActionFilter
{
    private static readonly HashSet<string> ExcludedControllers = new(StringComparer.Ordinal)
    {
        "AccessLog", "Logs"
    };

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var actionArguments = context.ActionArguments;
        var routeValues = context.RouteData.Values;
        var descriptor = context.ActionDescriptor as ControllerActionDescriptor;

        var executedContext = await next();

        try
        {
            await RecordIfEligibleAsync(context.HttpContext, descriptor, routeValues, actionArguments, executedContext);
        }
        catch
        {
        }
    }

    private async Task RecordIfEligibleAsync(
        HttpContext httpContext,
        ControllerActionDescriptor? descriptor,
        RouteValueDictionary routeValues,
        IDictionary<string, object?> actionArguments,
        ActionExecutedContext executedContext)
    {
        if (executedContext.Exception is not null && !executedContext.ExceptionHandled)
        {
            return;
        }

        if (descriptor is null || ExcludedControllers.Contains(descriptor.ControllerName))
        {
            return;
        }

        var action = AccessLogMapping.MapAction(httpContext.Request.Method);
        if (action is null)
        {
            return;
        }

        var statusCode = (executedContext.Result as IStatusCodeActionResult)?.StatusCode ?? 200;
        if (statusCode is < 200 or >= 300)
        {
            return;
        }

        var userName = AccessLogMapping.ResolveUserName(httpContext.User);

        var recordCodingAgentOnly = await settingsCache.GetRecordCodingAgentOnlyAsync(httpContext.RequestAborted);
        if (!AccessLogMapping.ShouldRecord(recordCodingAgentOnly, userName))
        {
            return;
        }

        var entityType = AccessLogMapping.MapEntityType(descriptor.ControllerName, descriptor.ActionName);
        var renderedContent = (executedContext.Result as ContentResult)?.Content;
        var resultValue = executedContext.Result switch
        {
            ObjectResult objectResult => objectResult.Value,
            FileResult fileResult => fileResult.FileDownloadName,
            ContentResult => AccessLogMapping.ExtractKeysFromRenderedText(renderedContent),
            _ => null
        };

        var entityId = AccessLogMapping.ResolveEntityId(routeValues, actionArguments, resultValue);
        var routeTemplateFallback = AccessLogMapping.ResolveRouteTemplateFallback(
            descriptor.AttributeRouteInfo?.Template, descriptor.ActionName);
        var entityName = AccessLogMapping.ResolveEntityName(
            routeValues, entityType, actionArguments, resultValue, entityId, routeTemplateFallback);

        string? details;
        try
        {
            var routePattern = (httpContext.GetEndpoint() as RouteEndpoint)?.RoutePattern.RawText?.TrimStart('/')
                ?? routeTemplateFallback;
            details = AccessLogMapping.BuildDetails(
                httpContext.Request.Method, routePattern, statusCode, action, entityName, resultValue, renderedContent, actionArguments);
        }
        catch
        {
            details = null;
        }

        var entry = new AccessLogEntry
        {
            AccessLogId = Guid.NewGuid(),
            OccurredAt = DateTime.UtcNow,
            Action = action,
            EntityType = entityType,
            EntityName = entityName,
            EntityId = entityId,
            UserName = userName,
            IpAddress = AccessLogMapping.ResolveIpAddress(
                httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault(),
                httpContext.Connection.RemoteIpAddress?.ToString()),
            Details = details
        };

        await repository.RecordAsync(entry, httpContext.RequestAborted);
    }
}
