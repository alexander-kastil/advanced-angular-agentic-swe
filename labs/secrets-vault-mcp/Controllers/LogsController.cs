using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using SecretsMcp.Services;

namespace SecretsMcp.Controllers;

[ApiController]
[Route("api/logs")]
public sealed class LogsController(DockerLogService docker) : ControllerBase
{
    [HttpGet("containers")]
    public async Task<IActionResult> Containers() => Ok(await docker.ListContainersAsync());

    [HttpGet("stream/{service}")]
    public async Task Stream(string service)
    {
        if (!HttpContext.WebSockets.IsWebSocketRequest)
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            return;
        }

        using var ws = await HttpContext.WebSockets.AcceptWebSocketAsync();
        using var cts = new CancellationTokenSource();

        var logTask = docker.StreamLogsAsync(service, ws, cts.Token);

        var buf = new byte[256];
        while (ws.State == WebSocketState.Open)
        {
            WebSocketReceiveResult result;
            try { result = await ws.ReceiveAsync(buf, CancellationToken.None); }
            catch { break; }
            if (result.MessageType == WebSocketMessageType.Close) break;
        }

        await cts.CancelAsync();
        await logTask;
    }
}
