using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;

namespace SecretsMcp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "CustomerOrMachine")]
public class McpServersController(IMcpServerRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken = default) =>
        Ok(await repository.ListAsync(cancellationToken));

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateMcpServerRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var server = await repository.CreateAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetAll), new { }, server);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{mcpServerId:guid}")]
    public async Task<IActionResult> Update(
        Guid mcpServerId,
        UpdateMcpServerRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var server = await repository.UpdateAsync(mcpServerId, request, cancellationToken);
            return server is null ? NotFound() : Ok(server);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{mcpServerId:guid}")]
    public async Task<IActionResult> Delete(
        Guid mcpServerId,
        CancellationToken cancellationToken = default)
    {
        var deleted = await repository.DeleteAsync(mcpServerId, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
