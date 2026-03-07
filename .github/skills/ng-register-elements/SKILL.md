---
name: ng-register-elements
description: Configure Angular projects for web components (Angular Elements) with dual development and distribution configurations.
---

## Configure Angular Elements

Automatically set up any Angular 21+ project for web component distribution with dual configurations:
- **Development mode** with zoneless change detection for testing
- **Distribution mode** without zoneless for web component deployment

### When to Use

- Setting up a new Angular Elements project
- Converting an existing Angular component to a web component
- Need both development and production element configurations
- Building web components for external integration
- Creating reusable Angular-based components

### Quick Start

```bash
node scripts/ng-configure-element.js <project-path>
```

### Available Commands After Setup

```bash
npm start               # Dev with zoneless change detection
npm run serve:element   # Preview element without zoneless
npm run build:element   # Build web component for distribution
```

### What Gets Created

- `src/main.element.ts` - Element entry point
- `src/app/app.config.element.ts` - Element configuration (no zoneless)
- `scripts/serve-element.sh` - Element dev server
- `scripts/build-element.sh` - Element build script
- Updated `package.json` with new npm commands

### Configuration Details

**Development** (`npm start`):
- Uses `provideZonelessChangeDetection()`
- Tests modern Angular behavior
- Default configuration

**Distribution** (`serve:element` / `build:element`):
- No zoneless providers
- Compatible when embedded in host applications
- Production-ready web component

### Example

```bash
# Configure a project
node scripts/ng-configure-element.js demos/11-elements/skills-list

# Test all three modes
cd demos/11-elements/skills-list
npm start              # Dev mode
npm run serve:element  # Element preview
npm run build:element  # Build for distribution
```

### Keywords

Angular, Elements, Web Components, standalone components, configuration, TypeScript, distribution
