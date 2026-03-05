Migrate `<app-markdown-renderer>` from individual sample components to the global `demo-container` layout using `angular-split` in $ARGUMENTS.

## Prerequisites

- `angular-split` installed: `npm install angular-split`
- Project has `db.json` with a `demos` array
- Sample components currently use `<app-markdown-renderer [md]="'<name>'" />`

## Steps

### 1. Add `md` field to `db.json`

For each demo entry, add `"md": "<markdown-name>"` matching the value currently in `<app-markdown-renderer [md]="'<VALUE>'" />`.

### 2. Update `DemoItem` model

Add `md: string = ''` to the `DemoItem` class.

### 3. Update `SidePanelService` to signal-based toggles

```typescript
@Injectable({ providedIn: 'root' })
export class SidePanelService {
  private _editorVisible = signal(false);
  private _rendererVisible = signal(true);
  editorVisible = this._editorVisible.asReadonly();
  rendererVisible = this._rendererVisible.asReadonly();
  toggleEditor() { this._editorVisible.update(v => !v); }
  toggleRenderer() { this._rendererVisible.update(v => !v); }
}
```

Delete `sidebar.actions.ts`.

### 4. Update `demo-container` to use `angular-split`

- Import `SplitComponent`, `SplitAreaComponent`, `MarkdownRendererComponent`
- Track current URL with signal set from `router.events` (`NavigationEnd`) using `takeUntilDestroyed()`
- Derive `currentMd` as `computed()` matching URL segment to `demos()` array `md` field
- Replace CSS grid with `<as-split direction="vertical">` containing 3 areas:
  - Workbench (size 60): `<router-outlet />`
  - Markdown Renderer (size 20, `[visible]="showRenderer() && !!currentMd()"`): `<app-markdown-renderer [md]="currentMd()" />`
  - Markdown Editor (size 20, `[visible]="showMdEditor()"`): `<app-markdown-editor-container />`

### 5. Remove `<app-markdown-renderer>` from sample components

Find all usages: `grep -r "app-markdown-renderer" src/app/demos/samples/`

For each: remove the HTML tag and the `MarkdownRendererComponent` import.

### 6. Add prismjs to `angular.json`

```json
"styles": ["node_modules/prismjs/themes/prism-okaidia.css", "src/styles.scss"],
"scripts": [
  "node_modules/prismjs/prism.js",
  "node_modules/prismjs/components/prism-typescript.min.js",
  "node_modules/prismjs/components/prism-javascript.min.js"
]
```

## Verification

1. `ng build` - no compile errors
2. Navigate to each demo - markdown renders in split pane
3. Toggle visibility with sidebar button
4. Code blocks render with dark syntax highlighting
