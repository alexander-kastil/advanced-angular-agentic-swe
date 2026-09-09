using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;

namespace SecretsMcp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "CustomerOrMachine")]
public class ModelsController(IModelRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? provider,
        CancellationToken cancellationToken = default) =>
        Ok(await repository.ListAsync(provider, cancellationToken));

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateModelRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var model = await repository.CreateAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetAll), new { provider = model.Provider }, model);
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

    [HttpPut("{provider}/{modelName}")]
    public async Task<IActionResult> Update(
        string provider,
        string modelName,
        UpdateModelRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var model = await repository.UpdateAsync(provider, modelName, request, cancellationToken);
            return model is null ? NotFound() : Ok(model);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{provider}/{modelName}")]
    public async Task<IActionResult> Delete(
        string provider,
        string modelName,
        CancellationToken cancellationToken = default)
    {
        var deleted = await repository.DeleteAsync(provider, modelName, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
