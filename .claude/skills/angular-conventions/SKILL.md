---
name: angular-conventions
description: Consolidated Angular conventions for components, dependency injection, forms, HTTP, routing, signals, MSAL authentication, and A2UI generative UI. Use when working on Angular applications and you need modern Angular guidance or routing into a specific Angular concern. Triggers on component creation, inject(), signal forms, httpResource(), guards, route configuration, computed(), linkedSignal(), MSAL, Azure Entra, A2UI, agent-driven / generative UI, Angular architecture, load-once data loading, ensureLoaded guards, duplicate HTTP requests, refetch-after-CRUD elimination, and production bundle-size optimization (initial budget exceeded, main.js too big, tree-shaking, lazy-init).
---

# Angular Conventions

Group reusable Angular guidance under one entry skill.

## When to Use This Skill

- The task is Angular-specific but not yet narrowed to one Angular topic.
- You need a single entry point for Angular components, DI, forms, HTTP, routing, or signals.
- The repository has its own Angular rules in `docs/` and you want to pair those with general Angular conventions.

## Defaults

| Topic                       | Current rule                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| Angular version             | Angular `22.x` or later                                                                    |
| Architecture                | Standalone components — do NOT set `standalone: true` (default since v20)                 |
| Change detection            | `ChangeDetectionStrategy.OnPush` on every component                                       |
| Dependency injection        | `inject()` function only — never constructor parameters                                    |
| Inputs / Outputs            | `input()` / `output()` signals — never `@Input()` / `@Output()` decorators                |
| Host bindings               | `host` object in `@Component` / `@Directive` — never `@HostBinding` / `@HostListener`    |
| Template control flow       | `@if` / `@for` / `@switch` — never `*ngIf` / `*ngFor` / `*ngSwitch`                      |
| Class and style bindings    | `[class.x]` / `[style.x]` — never `ngClass` / `ngStyle`                                  |
| Local state                 | `signal()` — never `BehaviorSubject`                                                       |
| HTTP reads                  | `httpResource()` for reactive reads; `HttpClient` for mutations                            |
| Forms                       | Signal Forms (`form()` + `[formField]`) — never Reactive Forms or `ngModel`               |
| Scaffolding                 | Angular CLI for components, services, directives, and pipes                                |
| Project structure           | Feature-based folder organization; flat feature folders for smaller apps                   |
| Routing                     | `app.routes.ts` with functional guards and lazy-loaded feature routes                     |
| Component file layout       | Separate `.ts`, `.html`, `.css` files; kebab-case names; one folder per component         |

## Usage Note

- This skill captures shared Angular 22 conventions. Always check the target repository's own `docs/` or `CLAUDE.md` for repo-specific overrides (API base URLs, store architecture, auth provider, money conventions, etc.) before applying these defaults.

## Component File Organization

Angular projects use a functional storage hierarchy:

```
app/
  <feature>/              ← domain/feature folder (auth, person, cart, …)
    <component-name>/     ← one folder per component
      <component-name>.ts
      <component-name>.html  (if separate template)
      <component-name>.spec.ts
    <service>.ts          ← services live at feature level, not in a sub-folder
  shared/                 ← cross-cutting UI components used across features
    <shared-component>/
  store/                  ← global state (NgRx store, signal stores)
```

Rules:

- Each component gets its own folder named after the component.
- Files inside the folder share the component's name (e.g., `user-card/user-card.ts`).
- Services are placed at the feature level, not inside a component sub-folder.
- `shared/` contains components reused across multiple features.
- `store/` contains global state artifacts.

## Delegate Map

| Request type                                          | Reference to use                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------------ |
| Build or refactor standalone components               | [`angular-component`](references/angular-component.md)             |
| Component folder layout and file organization         | [`angular-component`](references/angular-component.md)             |
| Configure dependency injection or providers           | [`angular-di`](references/angular-di.md)                           |
| Build forms and validation flows                      | [`angular-forms`](references/angular-forms.md)                     |
| Implement API calls and data loading                  | [`angular-http`](references/angular-http.md)                       |
| Configure navigation and route behavior               | [`angular-routing`](references/angular-routing.md)                 |
| Model reactive state with signals                     | [`angular-signals`](references/angular-signals.md)                 |
| Design app state so one composed signal store fully serves the app (feature-per-domain, container/presenter binding) | [`angular-signal-store-design`](references/angular-signal-store-design.md) |
| Add a global store-driven activity indicator (HTTP request-counter + explicit AI-activity flag + interceptor + progress bar) | [`angular-activity-indicator`](references/angular-activity-indicator.md) |
| Load-once data loading with local CRUD sync (ensure*Loaded guards, in-flight dedupe/shareReplay, resolvers scoped to what a route reads, mutations patch the store instead of refetching, sessionStorage TTL cache, duplicate-request elimination) | [`angular-load-once-store`](references/angular-load-once-store.md) |
| Write unit tests with Vitest                          | [`angular-testing`](references/angular-testing.md)                 |
| Build a draggable/resizable two-pane splitter (`ux-splitter`) | [`angular-draggable-splitter`](references/angular-draggable-splitter.md) |
| Drag and drop for grids or reorderable lists without a library (cdkDrag alternative, reorder rows, draggable grid, drop target, not-allowed drop) | [`angular-drag-drop`](references/angular-drag-drop.md) |
| Build a bottom sheet with no Angular Material/CDK (native `<dialog>`, viewport-anchored, slide-up, imperative open()/close()) | [`angular-bottom-sheet`](references/angular-bottom-sheet.md) |
| Build a file drop zone / drag-and-drop file upload (dragover state, hidden input, single vs multi, `filesSelected` output, store-event variant) | [`angular-file-dropzone`](references/angular-file-dropzone.md) |
| Build a multi-step file-import wizard (upload → review/column-map → AI-assist → commit; draft in the store, no client-side parsing) | [`file-import-wiz`](references/file-import-wiz.md) |
| Blob download or a retained-documents list (blob download, document list, file download, object URL, retained documents, import documents; `HttpClient` blob → `createObjectURL` → anchor click) | [`blob-document-list`](references/blob-document-list.md) |
| Build a user & permission admin UI (RBAC: admin-users, admin-permissions, user/roles dialogs) backed by mixed auth (Entra MSAL + local JWT), with `withAuth`/`withAdmin` signal-store slices, a local-first token interceptor, and an `adminGuard` — admin UI, permission matrix, roles screen, RBAC UI, local login form, adminEmails | [`angular-users-permissions-admin`](references/angular-users-permissions-admin.md) |
| Spot or fix anti-patterns / legacy code               | [`angular-antipatterns`](references/angular-antipatterns.md)       |
| MSAL authentication overview: v5 breaking changes, interaction-type rule, 401 triage | [`angular-msal-auth`](references/angular-msal-auth.md) |
| MSAL client wiring deep-dive: providers, APP_INITIALIZER, AuthStateService, 401 troubleshooting | [`msal-angular`](references/msal-angular.md) |
| Entra app registration via Azure CLI: create from scratch, redirect URIs, platform types | [`msal-angular-appreg`](references/msal-angular-appreg.md) |
| Upgrade or update an Angular app to the latest version | [`angular-update`](references/angular-update.md) |
| Fix a failing production bundle-size budget: measure eager vs lazy chunks, non-ESM tree-shaking traps, raw-vs-gzip budgets, lazy-init a heavy lib via dynamic `import()` (reduce bundle, main.js too big, initial budget exceeded, tree-shaking, lazy load) | [`angular-bundle-optimization`](references/angular-bundle-optimization.md) |
| Migrate markdown-renderer into a split demo-container layout | [`angular-migrate-markdown`](references/angular-migrate-markdown.md) |
| Render agent-driven generative UI with the A2UI protocol (catalogs, surfaces, actions, theming) | [`angular-a2ui`](references/angular-a2ui.md) |
| Build a multi-step wizard / setup flow: full-width step-rail shell, phase-driven active/done states, two-column step body, copy-to-clipboard, real-data chip filters | [`angular-wizard`](references/angular-wizard.md) |

## Example Prompts

- "Use angular-conventions to choose the right pattern for a new Angular form."
- "Route this Angular data-loading task to the right conventions reference."
- "Use angular-conventions for a component and signals refactor."
- "Use angular-conventions to design a feature-per-domain signal store that fully serves the app."
- "Use angular-conventions to add a global store-driven activity indicator (HTTP + AI activity) with an interceptor."
- "Use angular-conventions to scaffold a standalone Angular component and confirm the right CLI command."
- "Use angular-conventions to upgrade this workspace to the latest Angular version."
- "Use angular-conventions to migrate markdown-renderer into the split demo-container layout."
- "Use angular-conventions to wire an A2UI renderer and custom catalog into an Angular client."
- "Use angular-conventions to add a drag-and-drop file drop zone that emits selected files to the store."
- "Use angular-conventions to build a file-import wizard (upload → review → commit) for Mieterlisten."
- "Use angular-conventions to add a retained-documents list with a blob download button."
