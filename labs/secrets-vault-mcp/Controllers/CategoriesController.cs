using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;

namespace SecretsMcp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthorizationPolicies.AgentCategories)]
public class CategoriesController(ICategoryRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] Guid? listId,
        CancellationToken cancellationToken = default) =>
        Ok(await repository.ListAsync(listId, cancellationToken));

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateCategoryRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var category = await repository.CreateAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetAll), new { listId = category.ListId }, category);
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

    [HttpPut("{categoryId:guid}")]
    public async Task<IActionResult> Update(
        Guid categoryId,
        UpdateCategoryRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var category = await repository.UpdateAsync(categoryId, request, cancellationToken);
            return category is null ? NotFound() : Ok(category);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    [HttpDelete("{categoryId:guid}")]
    public async Task<IActionResult> Delete(Guid categoryId, CancellationToken cancellationToken = default)
    {
        try
        {
            var deleted = await repository.DeleteAsync(categoryId, cancellationToken);
            return deleted ? NoContent() : NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }
}
