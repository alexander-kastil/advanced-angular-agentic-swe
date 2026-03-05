# Markdown Editor Feature — Implementation Task

## Context

This task describes the full current state of the **Markdown Editor** feature in
`demos/05-state-ngrx/ngrx-signal-store`. It is the source of truth for:

- Refactoring and optimisation of the store
- Adding Playwright tests
- Evaluating and optionally adopting NgRx Signal-Store Events

---

## 1. Feature Overview

The Markdown Editor is a mock CMS embedded in the bottom split-pane of the demo shell.  
It manages a list of `MarkdownItem` entities and introduces a special **Page** concept:
the currently active demo page can have its guide text customised and persisted.

### Data model

```ts
export class MarkdownItem {
    id: number = 0;      // 0 = unsaved comment, -1 = page override, >0 = persisted comment
    url: string = '';    // '' for comments, 'demos/<route>' for page overrides
    title: string = '';
    comment: string = ''; // markdown body
    saved?: Date;
}
```

REST endpoint: `GET|POST|PUT|DELETE /markdownItems` (json-server).  
`PUT /markdownItems/-1` upserts the page override using `id: -1` as the stable key.

---

## 2. Full Business Logic

### 2.1 Item types

| Type | `id` | `url` | Description |
|---|---|---|---|
| Comment | `> 0` | `""` | Regular user note |
| New comment | `0` | `""` | Unsaved, triggers POST |
| Page (ghost) | `-1` | `"demos/<route>"` | Virtual, not in DB |
| Page (unghosted) | `-1` | `"demos/<route>"` | Persisted in DB via PUT |

### 2.2 List composition (`allItems` computed)

`demoUrl = 'demos/' + currentUrl()` is passed as input to the editor container.

1. Search `store.entities()` for `i.id === -1 && i.url === demoUrl`
2. **Found (unghosted)** → place it at position 0, filter it from the rest
3. **Not found (ghost)** → prepend synthetic `{ id: -1, url, title, comment: demoMd() }`

### 2.3 Icon column

| Condition | Icon | Tooltip |
|---|---|---|
| `id === -1`, ghost | `article` (black) | "Page" |
| `id === -1`, unghosted | `article` (primary color) | "Page customized" |
| `id > 0` | `comment` | "Comment" |

`isDemoSaved = store.entities().some(i => i.id === -1 && i.url === demoUrl)`

### 2.4 Action buttons

| Condition | Left button | Right button |
|---|---|---|
| `id === -1`, ghost | *(no-delete placeholder)* | Edit |
| `id === -1`, unghosted | Reset | Edit |
| `id > 0` | Delete | Edit |

### 2.5 Edit form

- **Title**: `readonly` when `id === -1` (page item) — rendered as plain `[value]` bound input, not `[formField]`
- **Comment/Content**: always editable via `[formField]="itemForm.comment"`
- When editing a page item: `mdSrc` input receives the page md key (`current()!.comment` which holds the md name when ghost, or the already-saved content).  
  `HttpClient` fetches `${environment.markdownPath}${src}.md` and writes result back via `markdownItem.update(item => ({ ...item, comment: content }))`.
- Uses Angular Signal Forms (`form()`, `FormField`) with `model()` two-way binding.

### 2.6 Save

- Always calls `store.saveMarkdownItem(item)` as-is (no id conversion).
- `MarkdownEditorService.saveMarkdownItem`:
  - `id === 0 | undefined` → `POST /markdownItems`
  - `id !== 0` → `PUT /markdownItems/${id}` (covers `id: -1` for page overrides)
- After save: entity is in store → `isDemoSaved` becomes `true` → ghost → unghosted.

### 2.7 Reset (delete page override)

- Calls `store.deleteMarkdownItem(item)` on the `id: -1` entity.
- `DELETE /markdownItems/-1` → removed from DB.
- `removeEntity(-1)` → entity gone from store → `isDemoSaved` = `false` → back to ghost.

### 2.8 Guide mode

`guideMd()` in `DemoContainerComponent`:

```ts
guideMd = computed(() => {
    const url = `demos/${this.currentUrl()}`;
    const override = this.markdownStore.entities().find(i => i.id === -1 && i.url === url);
    return override?.comment ?? this.currentMd();
});
```

- If page override exists: renders its `comment` (customised markdown) in the guide pane.
- Otherwise: renders the original `.md` file.

---

## 3. Current File Inventory

```
src/app/shared/markdown-editor/
  markdown.model.ts
  markdown-editor.service.ts
  markdown-editor.store.ts          ← main store (providedIn: root)
  with-markdown-items.ts            ← store feature: entities + rxMethods
  with-loading-state.ts             ← store feature: loading flag
  components/
    markdown-editor-container/      ← smart container (demoTitle, demoMd, demoUrl inputs)
    editor-container/               ← standalone variant (no page concept)
    markdown-list/                  ← dumb list (items, demoUrl, demoSaved inputs)
    markdown-edit/                  ← edit form (markdownItem model, mdSrc model)
src/app/demos/demo-container/
  demo-container.component.ts       ← injects markdownEditorStore, provides guideMd()
```

---

## 4. Known Issues / Errors to Fix

1. **`markdown-edit.component.html` — `mdSrc` driven content**  
   When `mdSrc` is set for a page item that is already unghosted (saved in DB), the effect re-fetches the original file and overwrites the saved content. The effect should only run when `mdSrc` refers to a filename (not when `markdownItem().id === -1` but already unghosted with comment content).  
   Fix: guard the effect — only fetch if `src` does not contain newlines (i.e. it's a filename, not full content).

2. **`editor-container.component.ts` — no `demoUrl`/`isDemoSaved` logic**  
   The plain `EditorContainerComponent` variant does not receive `demoUrl`/`demoSaved` inputs and does not pass them to `<app-markdown-list>`. Icons and tooltips work but Reset/ghost logic is absent. Either add the inputs or document it as intentional.

3. **`allItems` identity — `track c` in `@for`**  
   Currently `@for (c of items(); track c)` tracks by object reference. After save/delete the reference changes. Should be `track c.id` for correct DOM recycling.

4. **`saveMarkdownItem` in service — `id === 0 | undefined` check**  
   `item.id === undefined || item.id === 0` triggers POST. But `id: -1` page items hit PUT correctly. This is correct but fragile — document or extract to a helper.

5. **No error handling in `tapResponse`**  
   `logError` only `console.error`. No user-visible error state exists. Extend `withLoadingState` or add an `errorMessage` signal.

---

## 5. Optimisation Tasks for `markdown-editor.store.ts`

Move as much business logic as possible out of the container component and into the store.

### 5.1 Add computed selectors to `withMarkdownItems`

```ts
// inside withMarkdownItems()
withComputed((store) => ({
    pageOverrides: computed(() => store.entities().filter(i => i.id === -1)),
    comments: computed(() => store.entities().filter(i => i.id > 0)),
    getPageOverride: computed(() => (url: string) =>
        store.entities().find(i => i.id === -1 && i.url === url) ?? null
    ),
    isPageSaved: computed(() => (url: string) =>
        store.entities().some(i => i.id === -1 && i.url === url)
    ),
}))
```

### 5.2 Add `savePageOverride` and `resetPageOverride` to the store

Move the `id: -1` + url construction out of the container:

```ts
savePageOverride(url: string, title: string, comment: string): void
resetPageOverride(url: string): void
```

### 5.3 Move `allItems` logic into a store selector

```ts
listItems(url: string, title: string, fallbackMd: string): MarkdownItem[]
```

### 5.4 Add error state to store

```ts
withState({ isLoading: false, error: null as string | null })
// tapResponse error handler: patchState(store, { error: err.message })
```

### 5.5 Wrap save result timestamp

In `saveMarkdownItem` (service), always set `saved: new Date().toISOString()` before POST/PUT.

---

## 6. NgRx Signal Store Events — Research

Reference: https://ngrx.io/guide/signals/signal-store/events

### What it is

`withEvents()` from `@ngrx/signals/events` introduces a typed event bus inside a SignalStore.  
You define events with `createEvent()` and handle them with `withReducer()` and `withEffects()`.  
It mirrors the classic NgRx action/reducer/effect pattern but scoped to a single store.

### Does it make sense here?

**Yes, for the following reasons:**

| Current | With Events |
|---|---|
| `saveMarkdownItem(item)` calls rxMethod directly from template | `dispatch(SaveMarkdownItem({ item }))` decouples UI from effect |
| `deleteMarkdownItem(item)` has no pre/post hooks | Events allow `DeleteMarkdownItemSuccess` / `DeleteMarkdownItemFailed` side effects |
| Error state is not surfaced | `SaveMarkdownItemFailed({ error })` reducer sets `error` signal |
| `fetchMarkdownItems` runs once on init, no retry | `FetchMarkdownItemsRetry` event easy to add |
| Guide mode override logic duplicated in container and demo-container | A `PageOverrideSaved` event can notify both stores |

**Suggested events:**

```ts
const FetchMarkdownItems     = createEvent('[MarkdownEditor] Fetch');
const SaveMarkdownItem       = createEvent('[MarkdownEditor] Save',   props<{ item: MarkdownItem }>());
const SaveMarkdownItemOk     = createEvent('[MarkdownEditor] Save OK', props<{ saved: MarkdownItem }>());
const SaveMarkdownItemFailed = createEvent('[MarkdownEditor] Save Failed', props<{ error: string }>());
const DeleteMarkdownItem     = createEvent('[MarkdownEditor] Delete', props<{ item: MarkdownItem }>());
const ResetPageOverride      = createEvent('[MarkdownEditor] Reset Page', props<{ url: string }>());
```

**Conclusion**: Adopt `withEvents()` in this demo — it is a natural fit, adds the missing error/success surface, and is a good teaching example of the full events pattern alongside the existing CRUD and entity patterns.

---

## 7. Playwright Tests — Full Feature Coverage

Create test file: `e2e/markdown-editor.spec.ts`

### 7.1 Setup

```ts
test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Demos' }).click();
    await page.getByRole('listitem').filter({ hasText: 'SignalStore App State' }).click();
    // Switch to editor mode (not guide mode)
});
```

### 7.2 List rendering

- [ ] Ghost page item appears as first row with title matching current demo
- [ ] Ghost page item has `article` icon (not primary colored)
- [ ] Ghost page item has tooltip "Page"
- [ ] Ghost page item has Edit button but no Reset/Delete button
- [ ] Comment items have `comment` icon with tooltip "Comment"
- [ ] Comment items have Delete and Edit buttons

### 7.3 Edit — page item (ghost)

- [ ] Clicking Edit on page item opens edit form
- [ ] Title field is readonly (cannot type)
- [ ] Comment textarea is populated with fetched `.md` file content
- [ ] Comment textarea is editable
- [ ] Cancel returns to list without changes

### 7.4 Save — ghost → unghosted

- [ ] Modify comment textarea content
- [ ] Click Save
- [ ] List shows same item at top with `article` icon in primary color
- [ ] Tooltip becomes "Page customized"
- [ ] Reset button appears
- [ ] `GET /markdownItems` (or store) contains entry with `id: -1` and correct `url`
- [ ] Guide pane shows the saved custom content (not the original md file)

### 7.5 Reset — unghosted → ghost

- [ ] Click Reset on unghosted page item
- [ ] `DELETE /markdownItems/-1` fired
- [ ] Item reverts to ghost state (black icon, no Reset button)
- [ ] Guide pane reverts to original md file content

### 7.6 Comments CRUD

- [ ] Click Add → empty edit form appears
- [ ] Fill title and comment → Save → item appears in list
- [ ] Edit existing comment → modify → Save → list updated
- [ ] Delete comment → item removed from list
- [ ] All operations persist (reload page, items still present)

### 7.7 Guide mode

- [ ] Toggle to guide mode
- [ ] Original md content renders when no page override
- [ ] After saving page override: custom content renders
- [ ] After reset: original content renders again

### 7.8 Cross-demo navigation

- [ ] Navigate to different demo → ghost item title updates
- [ ] Return to first demo → unghosted state preserved (Reset still visible)

---

## 8. Acceptance Criteria

- All Playwright tests green
- `markdown-editor.store.ts` contains all selectors, helpers, and event wiring — containers hold no business logic
- `withEvents()` adopted with full event set listed in §6
- Error state visible in UI (snackbar or inline)
- `@for` tracks by `c.id`
- `md-editor.spec.ts` passes against live json-server
