---
name: ng-migrate-md
description: Migrate markdown-renderer from individual sample components to a global split pane in demo-container. Moves the md name to db.json and removes per-component usage.
agent: Angular Expert
---

## Goal

Migrate the `<app-markdown-renderer>` from individual sample component templates to the global `demo-container` layout using `angular-split`. After migration, the markdown guide is rendered in a dedicated split pane that reads the `md` field from `db.json` based on the active route.

## Prerequisites

- `angular-split` must be installed: `npm install angular-split`
- The project must have a `db.json` with a `demos` array
- Each sample component currently has `<app-markdown-renderer [md]="'<name>'" />`

## Migration Steps

### Step 1: Add `md` field to `db.json`

For each demo entry in `db.json`, add an `md` property matching the markdown name currently passed to `<app-markdown-renderer>` in that sample's HTML template.

**Example:**

```json
{
  "url": "app-state",
  "title": "SignalStore App State",
  "sortOrder": 1,
  "topic": "SignalStore Fundamentals",
  "id": 1,
  "md": "app-state"
}
```

**How to find the md value:** Open each sample's `.component.html` and extract the string from `<app-markdown-renderer [md]="'<VALUE>'" />`.

### Step 2: Update `DemoItem` model

Add `md: string = ''` to the `DemoItem` class.

### Step 3: Update `SidePanelService`

Replace enum-based commands with simple boolean signal toggles:

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidePanelService {
  private _editorVisible = signal(false);
  private _rendererVisible = signal(true);

  editorVisible = this._editorVisible.asReadonly();
  rendererVisible = this._rendererVisible.asReadonly();

  toggleEditor() {
    this._editorVisible.update(v => !v);
  }

  toggleRenderer() {
    this._rendererVisible.update(v => !v);
  }
}
```

Delete `sidebar.actions.ts` — it is no longer needed.

### Step 4: Update `SidePanelComponent`

Remove `SidebarActions`, `SnackbarService`, and `RendererStateService` dependencies. Add three toggle methods:

```typescript
toggleEditor() { this.eb.toggleEditor(); }
toggleSideNav() { this.sidenav.toggleMenuVisibility(); }
toggleRenderer() { this.eb.toggleRenderer(); }
```

Template buttons:

```html
<button mat-mini-fab (click)="toggleSideNav()"><mat-icon>menu</mat-icon></button>
<button mat-mini-fab (click)="toggleRenderer()"><mat-icon>description</mat-icon></button>
<button mat-mini-fab (click)="toggleEditor()"><mat-icon>edit_note</mat-icon></button>
```

### Step 5: Update `demo-container` component

1. Import `SplitComponent`, `SplitAreaComponent` from `angular-split` and `MarkdownRendererComponent`
2. Track the current URL with a signal set from `router.events` (`NavigationEnd`) using `takeUntilDestroyed()`
3. Derive `currentMd` as a `computed()` that matches the URL segment against `demos()` and returns the `md` field
4. Bind `showMdEditor = this.eb.editorVisible` and `showRenderer = this.eb.rendererVisible`
5. Replace the CSS grid layout with `<as-split direction="vertical">` containing 3 areas:
   - **Workbench** (size 60): `<router-outlet />`
   - **Markdown Renderer** (size 20, `[visible]="showRenderer() && !!currentMd()"`): `<app-markdown-renderer [md]="currentMd()" />`
   - **Markdown Editor** (size 20, `[visible]="showMdEditor()"`): `<app-markdown-editor-container />`

### Step 6: Remove `<app-markdown-renderer>` from sample components

For each sample component:

1. **HTML template:** Remove the `<app-markdown-renderer [md]="'...'" />` line
2. **TypeScript file:** Remove the `MarkdownRendererComponent` import statement and remove it from the `imports` array

**Affected components** (scan all `*.component.html` under `demos/samples/` for `app-markdown-renderer`):

- Find with: `grep -r "app-markdown-renderer" src/app/demos/samples/`

### Step 7: Update SCSS

Simplify the grid layout since workbench/mdeditor areas are now handled by angular-split:

```scss
.gdSidenavContent {
  grid-template-rows: 65px auto;
  grid-template-columns: auto 80px;
  grid-template-areas:
    "toolbar toolbar"
    "main sidebar";
}

.gdMain {
  grid-area: main;
  overflow: hidden;
}

.split-content {
  height: 100%;
  overflow: auto;
  padding: 4px;
}
```

### Step 8: Fix code block syntax highlighting in `angular.json`

Markdown code blocks require prismjs assets to be bundled. Without them, code blocks render as unstyled plain text.

Add the prismjs CSS theme to `styles` and its scripts to `scripts` in `angular.json`:

```json
"styles": [
  "node_modules/prismjs/themes/prism-okaidia.css",
  "src/styles.scss"
],
"scripts": [
  "node_modules/prismjs/prism.js",
  "node_modules/prismjs/components/prism-typescript.min.js",
  "node_modules/prismjs/components/prism-javascript.min.js"
]
```

`prismjs` is already a dependency — no additional install needed.

## Verification

1. Run `ng build` to verify no compile errors
2. Start the app and navigate to each demo — the markdown guide should appear in the split pane
3. Toggle the markdown guide visibility using the sidebar button
4. Drag split gutters to resize panes
5. Hidden panes should collapse fully (angular-split `[visible]` binding)
6. Code blocks in markdown guides should render with dark Okaidia syntax highlighting
