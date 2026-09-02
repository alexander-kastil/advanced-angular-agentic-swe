# Agentic Angular Engineering Demo Module

Angular 22 shell for module 01. The demo list is driven by `db.json`, which is served as a static
asset, so no backend is needed.

```bash
npm install
npm start     # http://localhost:4200
npm run build
npm test
```

| #   | Route | Title | Teaches | Topic |
| --- | ----- | ----- | ------- | ----- |
| 1 | `angular-mcp-server` | Angular CLI MCP Server | Register the Angular CLI MCP server and browse the nine tools it exposes, with run_target and the three devserver tools stable as of 22.1. See what --read-only and --local-only drop, and copy the config for Claude Code or VS Code. | Agentic Tooling |
| 2 | `harness-files` | Harness Files | Compare CLAUDE.md, AGENTS.md and .github/copilot-instructions.md side by side, written from the rules get_best_practices actually returns for Angular 22. Understand scope, precedence, per-turn cost and what belongs in a skill instead. | Agentic Tooling |
| 3 | `agent-skills` | Agent Skills | Weigh the official Angular Agent Skills against this repo's own angular-conventions skill and see which one wins per question. Then build a SKILL.md and watch the frontmatter description that does the routing. | Customization |
| 4 | `angular-expert-agent` | Angular Expert Agent | Define a specialized subagent in .claude/agents with its own frontmatter, tool allowlist and model. Sort rules into the agent file or a skill, and decide which prompts get routed to it at all. | Customization |
| 5 | `hooks-and-gates` | Hooks & Quality Gates | Wire settings.json hooks that enforce what instructions only ask for: format on write with PostToolUse, block a banned Angular API with PreToolUse, and refuse to end a session on a red build with Stop. | Automation |
| 6 | `webmcp-counterpart` | WebMCP Counterpart | Expose the running app to a browser agent with declareExperimentalWebMcpTool() from @angular/core. Register two live tools, read the tools/list payload an agent would see, and watch registration no-op where no model context exists. | Automation |
