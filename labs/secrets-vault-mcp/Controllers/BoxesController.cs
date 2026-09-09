using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;

namespace SecretsMcp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthorizationPolicies.AgentBoxes)]
public class BoxesController(IBoxRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken = default) =>
        Ok(await repository.ListAsync(cancellationToken));

    [HttpGet("{boxId:guid}")]
    public async Task<IActionResult> GetById(Guid boxId, CancellationToken cancellationToken = default)
    {
        var box = await repository.GetByIdAsync(boxId, cancellationToken);
        return box is null ? NotFound() : Ok(box);
    }

    [HttpPost]
    public async Task<IActionResult> Create(UpsertBoxRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var box = await repository.CreateAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { boxId = box.BoxId }, box);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{boxId:guid}")]
    public async Task<IActionResult> Update(
        Guid boxId, UpsertBoxRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var box = await repository.UpdateAsync(boxId, request, cancellationToken);
            return box is null ? NotFound() : Ok(box);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{boxId:guid}")]
    public async Task<IActionResult> Delete(Guid boxId, CancellationToken cancellationToken = default) =>
        await repository.DeleteAsync(boxId, cancellationToken) ? NoContent() : NotFound();

    [HttpPost("credentials/{boxId:guid}")]
    public async Task<IActionResult> CreateCredential(
        Guid boxId, UpsertBoxCredentialRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var credential = await repository.CreateCredentialAsync(boxId, request, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { boxId }, credential);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("credentials/{boxId:guid}/{credentialId:guid}")]
    public async Task<IActionResult> UpdateCredential(
        Guid boxId, Guid credentialId, UpsertBoxCredentialRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var credential = await repository.UpdateCredentialAsync(boxId, credentialId, request, cancellationToken);
            return credential is null ? NotFound() : Ok(credential);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("credentials/{boxId:guid}/{credentialId:guid}")]
    public async Task<IActionResult> DeleteCredential(
        Guid boxId, Guid credentialId, CancellationToken cancellationToken = default) =>
        await repository.DeleteCredentialAsync(boxId, credentialId, cancellationToken) ? NoContent() : NotFound();

    [HttpPost("credentials/file/{boxId:guid}/{credentialId:guid}")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(1048576)]
    public async Task<IActionResult> UploadCredentialFile(
        Guid boxId, Guid credentialId, [FromForm] IFormFile? file, CancellationToken cancellationToken = default)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest("A file is required.");
        }

        using var buffer = new MemoryStream();
        await file.CopyToAsync(buffer, cancellationToken);

        var credential = await repository.SaveCredentialFileAsync(
            boxId, credentialId, file.FileName, file.ContentType, buffer.ToArray(), cancellationToken);

        return credential is null ? NotFound() : Ok(credential);
    }

    [HttpGet("credentials/file/{boxId:guid}/{credentialId:guid}")]
    public async Task<IActionResult> GetCredentialFile(
        Guid boxId, Guid credentialId, CancellationToken cancellationToken = default)
    {
        var stored = await repository.GetCredentialFileAsync(boxId, credentialId, cancellationToken);
        return stored is null ? NotFound() : File(stored.Content, stored.ContentType, stored.FileName);
    }

    [HttpDelete("credentials/file/{boxId:guid}/{credentialId:guid}")]
    public async Task<IActionResult> DeleteCredentialFile(
        Guid boxId, Guid credentialId, CancellationToken cancellationToken = default) =>
        await repository.DeleteCredentialFileAsync(boxId, credentialId, cancellationToken) ? NoContent() : NotFound();

    [HttpPost("apps/{boxId:guid}")]
    public async Task<IActionResult> CreateApp(
        Guid boxId, UpsertBoxAppRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var app = await repository.CreateBoxAppAsync(boxId, request, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { boxId }, app);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("apps/{boxId:guid}/{boxAppId:guid}")]
    public async Task<IActionResult> UpdateApp(
        Guid boxId, Guid boxAppId, UpsertBoxAppRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var app = await repository.UpdateBoxAppAsync(boxId, boxAppId, request, cancellationToken);
            return app is null ? NotFound() : Ok(app);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("apps/{boxId:guid}/{boxAppId:guid}")]
    public async Task<IActionResult> DeleteApp(
        Guid boxId, Guid boxAppId, CancellationToken cancellationToken = default) =>
        await repository.DeleteBoxAppAsync(boxId, boxAppId, cancellationToken) ? NoContent() : NotFound();
}
