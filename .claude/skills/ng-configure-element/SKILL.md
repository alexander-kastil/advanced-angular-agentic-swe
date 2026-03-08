---
name: ng-configure-element
description: Configure Angular projects for web components with dual development and distribution configurations.
---

## Configure Angular Elements

Automatically set up any Angular 21+ project for web component distribution with dual configurations.

### What It Does

Creates a complete Angular Elements setup with:
- **Development** mode using `provideZonelessChangeDetection()`
- **Element** mode without zoneless for distribution
- Three npm commands: `start`, `serve:element`, `build:element`

### When to Use

- Setting up a new Angular Elements project
- Converting components to web components
- Need development and production element builds
- Building web components for external applications
- Creating reusable Angular-based components

### Quick Usage

```bash
node scripts/ng-configure-element.js <project-path>
```

### Available Commands (Per Project)

```bash
npm start               # Development with zoneless
npm run serve:element   # Preview element without zoneless
npm run build:element   # Build for distribution
```

### What Gets Created

For each configured project:
- `src/main.element.ts` - Element entry point
- `src/app/app.config.element.ts` - Element config (no zoneless)
- Updated `angular.json` with `element` build and serve configurations
- Updated `tsconfig.app.json` so the element entry point is type-checked
- Updated `package.json` with new npm scripts

### Example

```bash
# Configure project
node scripts/ng-configure-element.js demos/11-elements/skills-list

# Use all modes
cd demos/11-elements/skills-list
npm start              # Test with zoneless
npm run serve:element  # Preview element
npm run build:element  # Build web component
```

### How It Works

The skill adds an Angular CLI `element` configuration:
1. Keep `src/main.ts` as the normal app entry point
2. Add `src/main.element.ts` as the element entry point
3. Configure `angular.json` so `serve:element` and `build:element` use the element entry point
4. Keep both entry points in `tsconfig.app.json` so Angular can type-check both modes

This avoids file swapping and works cleanly across Windows, PowerShell, bash, and CI environments.

### Configuration Comparison

| Aspect | Development | Element |
|--------|-------------|---------|
| Entry | `src/main.ts` | `src/main.element.ts` |
| Config | `app.config.ts` (zoneless) | `app.config.element.ts` (no zoneless) |
| Command | `npm start` | `npm run serve:element` / `npm run build:element` |

### Keywords

Angular, Elements, Web Components, standalone, configuration, TypeScript
