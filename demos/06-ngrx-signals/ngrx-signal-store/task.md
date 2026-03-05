# Task: Angular-Split Migration for Demo Container

This guide is about demos\05-state-ngrx\ngrx-signal-store. Work only in this folder and its subfolders. Do not edit files outside of this scope.

## What was done (Phase 2 — LayoutStore + 2-Pane Split)

Consolidated the 3-pane split into 2 panes (Workbench + Markdown). Created a `LayoutStore` using NgRx Signal Store to manage all layout state with localStorage persistence. Replaced `SidePanelService` and `sideNavStore` with the unified `LayoutStore`. Updated toggle logic so the Guide button toggles the Markdown pane and Editor button only appears when in Markdown mode.

## Current Architecture

### Split Pane Layout (`demo-container.component.html`)

```
<as-split direction="vertical" unit="pixel">
  ├── Workbench     (size="*")  — <router-outlet />
  └── Markdown      (size=300)  — Guide OR Editor based on markdownMode
</as-split>
```

- Workbench takes all remaining space (`size="*"` with `unit="pixel"`)
- Markdown pane is 300px, visible when `markdownPaneVisible()` is true
- Content switches between `<app-markdown-renderer>` (guide mode) and `<app-markdown-editor-container>` (editor mode) via `@if`/`@else`

### LayoutStore (`src/app/shared/layout/layout.store.ts`)

NgRx Signal Store managing all layout state with localStorage persistence:

```typescript
type LayoutState = {
  markdownPaneVisible: boolean;   // true by default
  markdownMode: 'guide' | 'editor';  // 'guide' by default
  sidenavVisible: boolean;        // true by default
  sidenavPosition: MatDrawerMode; // 'side' by default
};
```

Methods:
- `showGuide()` — toggles markdown pane visibility (guide mode). If guide is already active, hides pane. If pane hidden or in editor mode, shows pane + switches to guide.
- `showEditor()` — switches markdown mode to editor (pane must already be visible)
- `toggleSidenavVisible()` / `setSidenavVisible()` / `setSidenavPosition()` — sidenav state

Computed:
- `isGuideActive` — true when pane visible AND mode is guide
- `isEditorActive` — true when pane visible AND mode is editor

Persistence: `withHooks.onInit` loads from `localStorage['layout-state']` and an `effect()` persists full state on every change.

### SideNavService (`src/app/shared/sidenav/sidenav.service.ts`)

Remains as a separate service facade but now delegates to `LayoutStore` instead of the deleted `sideNavStore`. Still handles breakpoint observation for responsive behavior.

### Side Panel (`SidePanelComponent`)

Two always-visible buttons + one conditional:
- `menu` — toggles sidenav via `SideNavService.toggleMenuVisibility()`
- `description` — toggles markdown guide via `LayoutStore.showGuide()`
- `edit_note` — **only visible when markdown pane is open** — switches to editor via `LayoutStore.showEditor()`

## Files Changed (Phase 2)

| File | Change |
|------|--------|
| `src/app/shared/layout/layout.store.ts` | **Created** — NgRx Signal Store with localStorage persistence |
| `src/app/shared/layout/layout.store.spec.ts` | **Created** — Tests for store state, toggle logic, computed signals, persistence |
| `demo-container.component.html` | 2 split areas (Workbench `*` + Markdown 300px) with `@if`/`@else` for guide/editor |
| `demo-container.component.ts` | Replaced `SidePanelService` with `LayoutStore`, exposed `markdownPaneVisible`/`markdownMode` |
| `side-panel.component.ts` | Uses `LayoutStore` instead of `SidePanelService`, `showGuide()`/`showEditor()` methods |
| `side-panel.component.html` | Editor button wrapped in `@if (markdownPaneVisible())` |
| `side-panel.component.spec.ts` | Updated to test against `LayoutStore` |
| `sidenav.service.ts` | Delegates to `LayoutStore` instead of `sideNavStore` |
| `sidepanel.service.ts` | **Deleted** — replaced by LayoutStore |
| `sidepanel.service.spec.ts` | **Deleted** — replaced by layout.store.spec.ts |
| `sidenav.store.ts` | **Deleted** — replaced by LayoutStore |

## Dependencies

- `angular-split` — 2-pane layout with pixel-based sizing
- `@ngrx/signals` — `signalStore`, `withState`, `withComputed`, `withMethods`, `withHooks`
- `ngx-markdown` — used by `MarkdownRendererComponent`

## Build & Test Status

- `ng build` passes (no errors, no warnings except pre-existing budget warning)
- 30/32 tests pass (2 pre-existing `AppComponent` test failures, unrelated)
