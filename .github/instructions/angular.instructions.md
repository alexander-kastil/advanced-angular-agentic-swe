---
description: This file describes the conventions for Angular projects in this repository
---

## Standards

- **Angular Version**: 21.x or later
- **Architecture**: Standalone components preferred

## IMPORTANT RULES

- Write clean code. No comments. Do not over engineer!!!
- You always consult the Angular MCP for best practices
- Do not write docs if you are not asked to. If you are asked to write docs, be concise, short and to the point.

### Server & Development Rules

- **NEVER start `ng serve` or json-server unless explicitly asked by the user** - Always wait for explicit permission
- **NEVER use PowerShell for ANY file operations** - Use file system tools (create_file, copy files with proper tools) instead
- Use the running app provided by the user - do not start servers on your own initiative
- When you implement changes in the UI you check them using Chrome MCP

### File Operations Rules

- Use `create_file` tool for creating new files
- Use `replace_string_in_file` or `multi_replace_string_in_file` for editing existing files
- Never use terminal/PowerShell for copying, moving, or manipulating files
- If a file operation cannot be done with available tools, ask the user first before attempting workarounds

### Decision Making Rules

- When uncertain about executing major actions (starting servers, copying assets, running commands), **always ask for permission first**
- If instructions seem to conflict with a request, flag the conflict and seek clarification before proceeding
- Do not make assumptions about what is permitted - follow rules strictly

## Code Generation

Use Angular CLI for scaffolding components, services, and other constructs

```bash
ng generate component my-component
ng generate service my-service
ng generate directive my-directive
ng generate pipe my-pipe
```

## Development

- Run `ng serve` for local development server
- Run `ng build` for production builds
- Run `ng build --watch` for watch mode
- Follow feature-based folder organization for large projects
- Use routing modules or `app.routes.ts` as appropriate for the project structure
