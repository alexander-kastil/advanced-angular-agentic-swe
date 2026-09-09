using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;

namespace SecretsMcp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "Spa")]
public class ListsController(ISecretListRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken = default) =>
        Ok(await repository.ListAsync(cancellationToken));

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateSecretListRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var list = await repository.CreateAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetAll), new { listId = list.ListId }, list);
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

    [HttpPut("{listId:guid}")]
    public async Task<IActionResult> Update(
        Guid listId,
        UpdateSecretListRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var list = await repository.UpdateAsync(listId, request, cancellationToken);
            return list is null ? NotFound() : Ok(list);
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

    [HttpDelete("{listId:guid}")]
    public async Task<IActionResult> Delete(Guid listId, CancellationToken cancellationToken = default)
    {
        try
        {
            var deleted = await repository.DeleteAsync(listId, cancellationToken);
            return deleted is null ? NotFound() : NoContent();
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
}
