---
name: create-demo
description: Add a new demo to any module under demos/. Registers it in db.json, generates the component, adds the route, adds the markdown renderer, and creates an empty guide. Triggers on: add demo, create demo, new demo, register demo.
---

## Inputs

Collect before starting:

- **Module path** — e.g. `demos/03-signals/ng-signals`
- **Slug** — kebab-case, used for the route, folder, and markdown filename. E.g. `linked-signal`
- **Title** — shown in the sidenav. E.g. `Linked Signal`
- **Next id** — read `db.json → demos`, take `max(id) + 1`

## Steps

**1. Register in `db.json`**

```json
{ "id": <next-id>, "url": "<slug>", "title": "<Title>" }
```

**2. Generate the component**

```powershell
cd <module-path>
npx ng generate component demos/samples/<slug> --change-detection OnPush --inline-style --skip-tests
```

**3. Set up the template**

Replace the generated template with:

```html
<app-markdown-renderer [md]="'<slug>'" />
```

Add to the component's `imports` array:

```typescript
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
```

**4. Create the markdown guide**

Create `public/markdown/<slug>.md` — must not be empty or the renderer will 404:

```markdown
- Guide coming soon.
```

**5. Add the route**

In `src/app/demos/demo.routes.ts`:

```typescript
import { <PascalSlug>Component } from './samples/<slug>/<slug>.component';

{ path: '<slug>', component: <PascalSlug>Component },
```

**6. Verify**

```powershell
npx ng build --configuration development 2>&1 | Select-Object -Last 10
```

## Paths at a glance

| Artifact | Path |
|---|---|
| Component | `src/app/demos/samples/<slug>/` |
| Route | `src/app/demos/demo.routes.ts` |
| Guide | `public/markdown/<slug>.md` |
| Registration | `db.json → demos` |

## Example — `linked-signal` in `demos/03-signals/ng-signals`

```powershell
npx ng generate component demos/samples/linked-signal --change-detection OnPush --inline-style --skip-tests
```

`db.json`: `{ "id": 13, "url": "linked-signal", "title": "Linked Signal" }`

`demo.routes.ts`: `{ path: 'linked-signal', component: LinkedSignalComponent }`

`public/markdown/linked-signal.md`:
```markdown
- Examine `linked-signal.component.ts` and its use of `linkedSignal` to create a writable signal that resets whenever its source changes
```


## Steps

### Step 1 — Register in `db.json`

Append to the `demos` array in `<module>/db.json`:

```json
{
  "id": <next-id>,
  "url": "<slug>",
  "title": "<Title>"
}
```

### Step 2 — Generate the component

Run the Angular CLI from the module root:

```powershell
cd <module-path>
npx ng generate component demos/samples/<slug> --change-detection OnPush --inline-style --skip-tests
```

Flags:
- `--change-detection OnPush` — required by project conventions
- `--inline-style` — styles are minimal for demo components; avoids an extra file
- `--skip-tests` — spec files are written separately when needed

### Step 3 — Add `MarkdownRendererComponent` to the template

Replace the generated template content with:

```html
<app-markdown-renderer [md]="'<slug>'" />
```

Add `MarkdownRendererComponent` to the component's `imports` array:

```typescript
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-<slug>',
  imports: [MarkdownRendererComponent],
  templateUrl: './<slug>.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <PascalSlug>Component {}
```

> The path to `MarkdownRendererComponent` is relative — adjust `../` depth if the component is nested differently.

### Step 4 — Create the markdown guide

Create `<module-path>/public/markdown/<slug>.md` with a minimal placeholder:

```markdown
## <Title>

> Guide coming soon.
```

Do **not** leave the file empty — the markdown renderer will show a 404 error.

### Step 5 — Register the route

Add a child route to `<module-path>/src/app/demos/demo.routes.ts`:

```typescript
import { <PascalSlug>Component } from './samples/<slug>/<slug>.component';

// inside the children array:
{ path: '<slug>', component: <PascalSlug>Component },
```

Keep imports alphabetically sorted and routes in the same order as `db.json`.

### Step 6 — Verify the build

```powershell
cd <module-path>
npx ng build --configuration development 2>&1 | Select-Object -Last 15
```

Fix any TypeScript errors before finishing.

## Path conventions

| Artifact | Location |
|---|---|
| Component | `src/app/demos/samples/<slug>/` |
| Route registration | `src/app/demos/demo.routes.ts` |
| Markdown guide | `public/markdown/<slug>.md` |
| db.json | `<module-root>/db.json` |

## Example

Adding `linked-signal` to `demos/03-signals/ng-signals`:

```powershell
cd demos/03-signals/ng-signals
npx ng generate component demos/samples/linked-signal --change-detection OnPush --inline-style --skip-tests
```

`db.json` entry:
```json
{ "id": 13, "url": "linked-signal", "title": "Linked Signal" }
```

`demo.routes.ts` addition:
```typescript
import { LinkedSignalComponent } from './samples/linked-signal/linked-signal.component';
// ...
{ path: 'linked-signal', component: LinkedSignalComponent },
```

`public/markdown/linked-signal.md`:
```markdown
## Linked Signal

`linkedSignal` creates a writable signal whose default value is derived from another signal.
It resets automatically whenever the source signal changes.
```
