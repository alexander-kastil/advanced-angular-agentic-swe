using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;

namespace SecretsMcp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthorizationPolicies.AgentApps)]
public class AppsController(IAppRepository repository) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateAppRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var app = await repository.CreateAppAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { appId = app.AppId }, app);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("targets/{appId:guid}/{environmentId:guid}")]
    public async Task<IActionResult> SetTarget(
        Guid appId,
        Guid environmentId,
        SetAppTargetRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return Ok(await repository.SetAppTargetAsync(appId, environmentId, request.FilePath, cancellationToken));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("ordinal/{appId:guid}")]
    public async Task<IActionResult> SetOrdinal(
        Guid appId,
        SetAppOrdinalRequest request,
        [FromQuery] Guid? environmentId,
        CancellationToken cancellationToken = default)
    {
        var app = await repository.SetAppOrdinalAsync(appId, request.Ordinal, environmentId, cancellationToken);
        return app is null ? NotFound() : Ok(app);
    }

    [HttpPut("name/{appId:guid}")]
    public async Task<IActionResult> SetName(
        Guid appId,
        SetAppNameRequest request,
        [FromQuery] Guid? environmentId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var app = await repository.SetAppNameAsync(appId, request.Name, environmentId, cancellationToken);
            return app is null ? NotFound() : Ok(app);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("box/{appId:guid}")]
    public async Task<IActionResult> SetBox(
        Guid appId,
        SetAppBoxRequest request,
        [FromQuery] Guid? environmentId,
        CancellationToken cancellationToken = default)
    {
        var app = await repository.SetAppBoxAsync(appId, request.BoxId, environmentId, cancellationToken);
        return app is null ? NotFound() : Ok(app);
    }

    [HttpPut("registration/{appId:guid}")]
    public async Task<IActionResult> SetRegistration(
        Guid appId,
        SetAppRegistrationRequest request,
        [FromQuery] Guid? environmentId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var app = await repository.SetAppRegistrationAsync(appId, request, environmentId, cancellationToken);
            return app is null ? NotFound() : Ok(app);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("registration/{appId:guid}")]
    public async Task<IActionResult> DeleteRegistration(
        Guid appId,
        CancellationToken cancellationToken = default) =>
        await repository.DeleteAppRegistrationAsync(appId, cancellationToken) ? NoContent() : NotFound();

    [HttpPut("registration/manifest/{appId:guid}")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(1048576)]
    public async Task<IActionResult> UploadManifest(
        Guid appId,
        [FromForm] IFormFile? file,
        CancellationToken cancellationToken = default)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest("A file is required.");
        }

        using var buffer = new MemoryStream();
        await file.CopyToAsync(buffer, cancellationToken);

        var registration = await repository.SetAppRegistrationManifestAsync(
            appId, file.FileName, file.ContentType, buffer.ToArray(), cancellationToken);

        return registration is null ? NotFound() : Ok(registration);
    }

    [HttpGet("registration/manifest/{appId:guid}")]
    public async Task<IActionResult> DownloadManifest(
        Guid appId,
        CancellationToken cancellationToken = default)
    {
        var manifest = await repository.GetAppRegistrationManifestAsync(appId, cancellationToken);
        return manifest is null ? NotFound() : File(manifest.Content, manifest.ContentType, manifest.FileName);
    }

    [HttpPost("settings/{appId:guid}")]
    public async Task<IActionResult> CreateSetting(
        Guid appId,
        CreateSettingRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var setting = await repository.CreateSettingAsync(appId, request, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { appId }, setting);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("render/{appId:guid}")]
    public async Task<IActionResult> Render(
        Guid appId,
        [FromQuery] Guid environmentId,
        [FromQuery] string filePath,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var text = await repository.RenderAsync(appId, environmentId, filePath, cancellationToken);
            return Content(text, "text/plain");
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("import/{appId:guid}")]
    public async Task<IActionResult> Import(
        Guid appId,
        ImportRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return Ok(new { imported = await repository.ImportAsync(appId, request, cancellationToken) });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("diff/{appId:guid}")]
    public async Task<IActionResult> Diff(
        Guid appId,
        DiffRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return Ok(await repository.DiffAsync(appId, request, cancellationToken));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{appId:guid}")]
    public async Task<IActionResult> GetById(
        Guid appId,
        [FromQuery] Guid? environmentId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var app = await repository.GetAppSettingsAsync(appId, environmentId, cancellationToken);
            return app is null ? NotFound() : Ok(app);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
