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
- Never use Powershell for Angular code refactoring !!!
- Use the running app provided by the user!!!
- When you implement changes in the UI you check them using Chrome MCP

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
