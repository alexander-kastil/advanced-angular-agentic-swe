using System.Net.WebSockets;
using System.Text;
using Docker.DotNet;
using Docker.DotNet.Models;
using SecretsMcp.Contracts;

namespace SecretsMcp.Services;

/// <summary>
/// Reads the local Docker daemon for the log viewer: lists every container and follows one
/// container's combined stdout/stderr onto an open WebSocket until the client disconnects.
/// </summary>
public sealed class DockerLogService : IDisposable
{
    private readonly DockerClient _client = new DockerClientConfiguration().CreateClient();

    public async Task<List<ContainerInfo>> ListContainersAsync()
    {
        var containers = await _client.Containers.ListContainersAsync(
            new ContainersListParameters { All = true });
        return containers.Select(ToInfo).OrderBy(c => c.Service).ToList();
    }

    public async Task StreamLogsAsync(string service, WebSocket ws, CancellationToken ct)
    {
        ContainerListResponse container;
        try
        {
            container = await ResolveContainerAsync(service);
        }
        catch (Exception ex)
        {
            await WsSendAsync(ws, $"\n[error: {ex.Message}]\n", CancellationToken.None);
            return;
        }

        try
        {
            using var stream = await _client.Containers.GetContainerLogsAsync(
                container.ID,
                false,
                new ContainerLogsParameters
                {
                    ShowStdout = true,
                    ShowStderr = true,
                    Follow = true,
                    Tail = "100",
                    Timestamps = false,
                },
                ct);

            var buf = new byte[4096];
            while (!ct.IsCancellationRequested)
            {
                var result = await stream.ReadOutputAsync(buf, 0, buf.Length, ct);
                if (result.Count > 0 && ws.State == WebSocketState.Open)
                    await ws.SendAsync(buf.AsMemory(0, result.Count), WebSocketMessageType.Text, true, ct);
            }

            if (ws.State == WebSocketState.Open)
                await WsSendAsync(ws, "\n[stream ended]\n", CancellationToken.None);
        }
        catch (EndOfStreamException)
        {
            if (ws.State == WebSocketState.Open)
                await WsSendAsync(ws, "\n[stream ended]\n", CancellationToken.None);
        }
        catch (OperationCanceledException) { }
        catch (Exception ex)
        {
            if (ws.State == WebSocketState.Open)
                await WsSendAsync(ws, $"\n[error: {ex.Message}]\n", CancellationToken.None);
        }
    }

    /// <summary>Resolves a container by id prefix, exact name, or compose-service label.</summary>
    private async Task<ContainerListResponse> ResolveContainerAsync(string idOrName)
    {
        var list = await _client.Containers.ListContainersAsync(
            new ContainersListParameters { All = true });
        return list.FirstOrDefault(c =>
                c.ID.StartsWith(idOrName, StringComparison.OrdinalIgnoreCase) ||
                c.Names.Any(n => n.TrimStart('/') == idOrName) ||
                (c.Labels.TryGetValue("com.docker.compose.service", out var svc) && svc == idOrName))
            ?? throw new InvalidOperationException($"No container: {idOrName}");
    }

    private static ContainerInfo ToInfo(ContainerListResponse c) => new(
        Id: c.ID.Length >= 12 ? c.ID[..12] : c.ID,
        Name: c.Names.FirstOrDefault()?.TrimStart('/') ?? "",
        Service: c.Labels.TryGetValue("com.docker.compose.service", out var svc)
            ? svc
            : c.Names.FirstOrDefault()?.TrimStart('/') ?? "",
        Project: c.Labels.TryGetValue("com.docker.compose.project", out var proj) ? proj : "",
        Status: c.State,
        Image: c.Image);

    private static Task WsSendAsync(WebSocket ws, string text, CancellationToken ct) =>
        ws.SendAsync(Encoding.UTF8.GetBytes(text), WebSocketMessageType.Text, true, ct);

    public void Dispose() => _client.Dispose();
}
