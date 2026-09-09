using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;
using SecretsMcp.Services;

namespace SecretsMcp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "Spa")]
public class SecretsController(
    ISecretRepository repository,
    ICategoryRepository categoryRepository,
    ISecretListRepository listRepository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] Guid? listId,
        [FromQuery] string? search,
        [FromQuery] int limit = 200,
        CancellationToken cancellationToken = default) =>
        Ok(await repository.ListAsync(listId, search, limit, cancellationToken));

    [HttpGet("export")]
    public async Task<IActionResult> Export(CancellationToken cancellationToken = default)
    {
        var secrets = await repository.ListAllAsync(cancellationToken);
        var categoryNames = (await categoryRepository.ListAsync(null, cancellationToken))
            .ToDictionary(c => c.CategoryId, c => c.Topic);
        var listNames = (await listRepository.ListAsync(cancellationToken))
            .ToDictionary(l => l.ListId, l => l.Name);

        var csv = SecretCsvExport.Build(secrets, categoryNames, listNames);

        return File(csv, "text/csv; charset=utf-8", "secrets-export.csv");
    }

    [HttpGet("{name}")]
    public async Task<IActionResult> GetByName(
        string name,
        [FromQuery] Guid listId,
        [FromQuery] int? version,
        CancellationToken cancellationToken = default)
    {
        var secret = await repository.GetAsync(listId, name, version, cancellationToken);
        return secret is null ? NotFound() : Ok(secret);
    }

    [HttpGet("file/{name}")]
    public async Task<IActionResult> GetFile(
        string name,
        [FromQuery] Guid listId,
        CancellationToken cancellationToken = default)
    {
        var stored = await repository.GetFileAsync(listId, name, cancellationToken);
        return stored is null ? NotFound() : File(stored.Content, stored.ContentType, stored.FileName);
    }

    [HttpGet("versions/{name}")]
    public async Task<IActionResult> GetVersions(
        string name,
        [FromQuery] Guid listId,
        CancellationToken cancellationToken = default)
    {
        var versions = await repository.ListVersionsAsync(listId, name, cancellationToken);
        return versions.Count == 0 ? NotFound() : Ok(versions);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateSecretRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var secret = await repository.CreateAsync(request, cancellationToken);
            return CreatedAtAction(
                nameof(GetByName),
                new { name = secret.Name, listId = secret.ListId },
                secret);
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

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(52428800)]
    public async Task<IActionResult> Upload(
        [FromForm] Guid listId,
        [FromForm] IFormFile? file,
        [FromForm] string? name,
        [FromForm] string? comment,
        [FromForm] string? categoryIds,
        CancellationToken cancellationToken = default)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest("A file is required.");
        }

        using var buffer = new MemoryStream();
        await file.CopyToAsync(buffer, cancellationToken);

        try
        {
            var secret = await repository.UploadAsync(
                listId,
                name,
                comment,
                ParseCategoryIds(categoryIds),
                file.FileName,
                file.ContentType,
                buffer.ToArray(),
                cancellationToken);

            if (secret.Version > 1)
            {
                return Ok(secret);
            }

            return CreatedAtAction(
                nameof(GetByName),
                new { name = secret.Name, listId = secret.ListId },
                secret);
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

    [HttpPut("{name}")]
    public async Task<IActionResult> Update(
        string name,
        [FromQuery] Guid listId,
        UpdateSecretRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return Ok(await repository.UpdateAsync(listId, name, request, cancellationToken));
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
        catch (SecretNameConflictException ex)
        {
            return Conflict(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("rename/{name}")]
    public async Task<IActionResult> Rename(
        string name,
        [FromQuery] Guid listId,
        RenameSecretRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return Ok(await repository.RenameAsync(listId, name, request.NewName, cancellationToken));
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
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

    [HttpDelete("{name}")]
    public async Task<IActionResult> Delete(
        string name,
        [FromQuery] Guid listId,
        CancellationToken cancellationToken = default)
    {
        var deleted = await repository.DeleteAsync(listId, name, cancellationToken);
        return deleted == 0 ? NotFound() : NoContent();
    }

    private static IReadOnlyList<Guid> ParseCategoryIds(string? value) =>
        string.IsNullOrWhiteSpace(value)
            ? []
            : value
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(Guid.Parse)
                .ToList();
}
