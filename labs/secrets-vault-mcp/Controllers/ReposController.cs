using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretsMcp.Auth;
using SecretsMcp.Contracts;
using SecretsMcp.Repositories;

namespace SecretsMcp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthorizationPolicies.AgentRepos)]
public class ReposController(IAppRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken = default) =>
        Ok(await repository.ListReposAsync(cancellationToken));

    [HttpPost]
    public async Task<IActionResult> Register(
        RegisterRepoRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var repo = await repository.RegisterRepoAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { repoId = repo.RepoId }, repo);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{repoId:guid}")]
    public async Task<IActionResult> Update(
        Guid repoId,
        UpdateRepoRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var repo = await repository.UpdateRepoAsync(repoId, request, cancellationToken);
            return repo is null ? NotFound() : Ok(repo);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("databases")]
    public async Task<IActionResult> ListDatabases(CancellationToken cancellationToken = default) =>
        Ok(await repository.ListDatabasesAsync(cancellationToken));

    [HttpGet("export/{repoId:guid}")]
    public async Task<IActionResult> Export(
        Guid repoId,
        [FromQuery] Guid? environmentId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return Ok(await repository.ExportRepoAsync(repoId, environmentId, cancellationToken));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{repoId:guid}")]
    public async Task<IActionResult> GetById(
        Guid repoId,
        [FromQuery] Guid? environmentId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var repo = await repository.GetRepoEnvironmentAsync(repoId, environmentId, cancellationToken);
            return repo is null ? NotFound() : Ok(repo);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
