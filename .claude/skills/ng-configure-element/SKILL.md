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
- `scripts/serve-element.sh` - Dev server for element
- `scripts/build-element.sh` - Build script
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

The bash scripts temporarily swap entry points:
1. Backup `src/main.ts`
2. Copy `src/main.element.ts` → `src/main.ts`
3. Run ng serve/build
4. Restore original `src/main.ts`

This avoids modifying `angular.json` while supporting different configurations.

### Configuration Comparison

| Aspect | Development | Element |
|--------|-------------|---------|
| Entry | `src/main.ts` | `src/main.element.ts` |
| Config | `app.config.ts` (zoneless) | `app.config.element.ts` (no zoneless) |
| Command | `npm start` | `npm run serve/build:element` |

### Keywords

Angular, Elements, Web Components, standalone, configuration, TypeScript
