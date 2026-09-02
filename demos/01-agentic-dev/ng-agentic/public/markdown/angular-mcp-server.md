# Angular CLI MCP Server

The Angular CLI ships an MCP server. Registering it once gives every agent working in the repository
the workspace facts it would otherwise guess at.

## Register it

`.mcp.json` in the repository root (Claude Code):

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

`.vscode/mcp.json` for VS Code and Copilot uses a `servers` key and an explicit `"type": "stdio"`.
Running `npx ng mcp` in an interactive terminal prints the snippet instead of starting the server, so
you never have to remember the shape.

## The nine tools

| Tool | Does | `readOnlyHint` | Needs the network |
| --- | --- | --- | --- |
| `list_projects` | Every workspace, project, builder, prefix, style language and target from `angular.json`. | yes | no |
| `get_best_practices` | The coding standards guide matching the installed framework version. | yes | no |
| `search_documentation` | Searches the angular.dev index for a given major version. | yes | **yes** |
| `run_target` | Runs an architect target (`build`, `test`, `lint`) and returns the real output. | no | no |
| `devserver_start` | Starts `ng serve` in the background and returns the URL. | no | no |
| `devserver_wait_for_build` | Blocks until the running dev server finishes a rebuild, then reports diagnostics. | yes | no |
| `devserver_stop` | Stops a dev server the agent started. | no | no |
| `onpush_zoneless_migration` | Analyses zone.js usage and drives the migration file by file. | yes | no |
| `ai_tutor` | Loads a tutoring prompt so the agent teaches instead of writing the code for you. | yes | no |

## Stability in 22.1

Verified in the installed `@angular/cli` (`src/commands/mcp/mcp-server.js`): `run_target` and all
three `devserver_*` tools are members of `STABLE_TOOLS`, so they register by default with no opt-in.
`EXPERIMENTAL_TOOLS` is an empty array and the `devserver` experimental group is empty too, which
means the hidden `--experimental-tool` / `-E` flag currently enables nothing.

The server itself is still described as experimental on angular.dev. The distinction matters: the
label is on the server, not on these tools.

## Narrowing the grant

| Flag | Effect |
| --- | --- |
| `--read-only` | Registers only tools whose `readOnlyHint` is true. Drops `run_target`, `devserver_start` and `devserver_stop`. |
| `--local-only` | Registers only tools that never leave the machine. Drops `search_documentation`, the one tool with `openWorldHint: true`. |

Both together leave a server that can inspect and plan but cannot change the workspace or reach the
internet, which is a reasonable default for an agent you do not yet trust.

## Why it matters

Without the server an agent infers the project layout from file names and answers API questions from
training data. With it, `list_projects` returns the actual projects, `get_best_practices` returns the
rules for the version that is actually installed, and `run_target` returns the actual compiler
errors. The loop closes on evidence instead of on a claim.

## Try it

Ask: "List the Angular projects in this repo, load the best practices, then run the build target for
ng-agentic." Three tool calls, no shell guessing.
