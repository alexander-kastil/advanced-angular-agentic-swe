# Agentic Angular Software Engineering

This module sets up the agentic development environment the rest of the class runs on. You connect
the Angular CLI MCP server so agents read the real workspace, write the harness files that shape
every turn, package knowledge as skills, route Angular work to a specialized agent, enforce rules
with hooks instead of hope, and finally turn the direction around and expose the running Angular app
back to a browser agent with the experimental WebMCP API in Angular 22.

## Demo App

`ng-agentic` is an Angular 22 app. Its demo list is driven by `db.json`, served as a static asset, so
there is no backend to start.

```bash
cd ng-agentic
npm install
npm start
```

## Demos

| #   | Route | Title | Teaches | Topic |
| --- | ----- | ----- | ------- | ----- |
| 1 | `angular-mcp-server` | Angular CLI MCP Server | Register the Angular CLI MCP server and browse the nine tools it exposes, with run_target and the three devserver tools stable as of 22.1. See what --read-only and --local-only drop, and copy the config for Claude Code or VS Code. | Agentic Tooling |
| 2 | `harness-files` | Harness Files | Compare CLAUDE.md, AGENTS.md and .github/copilot-instructions.md side by side, written from the rules get_best_practices actually returns for Angular 22. Understand scope, precedence, per-turn cost and what belongs in a skill instead. | Agentic Tooling |
| 3 | `agent-skills` | Agent Skills | Weigh the official Angular Agent Skills against this repo's own angular-conventions skill and see which one wins per question. Then build a SKILL.md and watch the frontmatter description that does the routing. | Customization |
| 4 | `angular-expert-agent` | Angular Expert Agent | Define a specialized subagent in .claude/agents with its own frontmatter, tool allowlist and model. Sort rules into the agent file or a skill, and decide which prompts get routed to it at all. | Customization |
| 5 | `hooks-and-gates` | Hooks & Quality Gates | Wire settings.json hooks that enforce what instructions only ask for: format on write with PostToolUse, block a banned Angular API with PreToolUse, and refuse to end a session on a red build with Stop. | Automation |
| 6 | `webmcp-counterpart` | WebMCP Counterpart | Expose the running app to a browser agent with declareExperimentalWebMcpTool() from @angular/core. Register two live tools, read the tools/list payload an agent would see, and watch registration no-op where no model context exists. | Automation |
