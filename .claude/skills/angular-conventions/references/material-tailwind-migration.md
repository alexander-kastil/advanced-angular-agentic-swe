# Migrating an Angular app off Angular Material onto Tailwind v4

Verified end to end on an Angular 22 zoneless app with ~40 Material-using components: build clean,
51/51 unit tests, axe-core 0 violations across 20 routes.

## Wiring

`scripts/material-to-tailwind.sh --wire <app-dir> [--dry-run]` does the deterministic half of this
section (packages, `.postcssrc.json`, style order, the `*` reset). `--verify <app-dir>` is read-only
and reports whether an app is fully off Material and correctly wired; it is the finish-line check for
the sweep described further down.

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss
npm uninstall @angular/material @angular/cdk
```

`.postcssrc.json` in the app root:

```json
{ "plugins": { "@tailwindcss/postcss": {} } }
```

Put the Tailwind entry in `angular.json` **before** the SCSS entry:

```json
"styles": ["src/tailwind.css", "src/styles.scss"]
```

Author `src/tailwind.css` as plain CSS, not SCSS. `@import "tailwindcss"` inside a `.scss` file makes
sass try to resolve `tailwindcss` as a sass partial and fail; a separate `.css` entry sidesteps it
entirely, and `@tailwindcss/postcss` resolves the import itself with no `postcss-import`.

Order matters for a reason worth knowing: Tailwind emits into cascade layers, and **unlayered rules
always beat layered ones regardless of specificity**. That is what keeps existing component SCSS
working as overrides. It is also the source of the first trap below.

## Traps, in the order they bite

### The `*` reset deletes every Tailwind border

Legacy Angular apps commonly ship

```scss
* { margin: 0; padding: 0; border: 0; font-size: 100%; }
```

That `border: 0` is unlayered, so it silently overrides `border`, `border-b` and every other border
utility. No error, no warning, just no borders anywhere. Delete the rule; preflight already resets
margins and box-sizing properly. Keep at most `body { margin: 0 }`.

### `@apply` takes utilities only

`@apply btn` inside `.btn-primary` fails with *"Cannot apply unknown utility class"*, and so does
`@apply no-scrollbar` when `no-scrollbar` lives in `@layer components`. Two fixes:

- compose in the template: `class="btn btn-primary"`
- or declare the helper as a real utility so it becomes `@apply`-able:

```css
@utility no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { width: 0; height: 0; display: none; }
}
```

`peer` is a marker class, not a utility: put it directly on the element. Variants built on it
(`peer-checked:bg-primary`) do work through `@apply`.

### Preflight zeroes `<dialog>` margins

`showModal()` centres a dialog through the UA stylesheet's `margin: auto`. Preflight removes it and
the modal renders flush top-left. Set `margin: auto` explicitly:

```css
.modal {
  @apply w-[min(92vw,32rem)] rounded-lg border-0 bg-transparent p-0;
  margin: auto;
  max-height: calc(100dvh - 2rem);
}
.modal::backdrop { background-color: rgb(15 34 46 / 0.45); }
```

Native `<dialog>` stays the right replacement for `MatDialog`: focus trap, Esc, inert background and
`::backdrop` come free. Wire it with `viewChild.required` + `afterRenderEffect(() => el.showModal())`,
and handle `(close)` and `(cancel)` so Esc routes the same way as the Cancel button.

## Replacement map

| Material | Replacement |
|---|---|
| `<mat-card>` + parts | `div.card` / `.card-header` / `h2.card-title` / `.card-content` / `.card-actions` |
| `mat-raised-button`, `mat-flat-button` | `class="btn btn-primary"` |
| `mat-stroked-button` | `class="btn btn-outline"` |
| `mat-icon-button` | `class="btn-icon"` |
| `mat-mini-fab` | `class="btn-fab"` |
| `<mat-form-field>` + `<mat-label>` + `matInput` | `div.field` + `label.label` + `input.input` |
| `<mat-slide-toggle>` | small shared component wrapping `input[type=checkbox].sr-only` + a track/thumb span |
| `<mat-checkbox>` | `label.checkbox` around a native checkbox with `accent-color` |
| `<mat-button-toggle-group>` | `div.toggle-group` + `button.toggle-btn` with `[class.active]` |
| `<mat-progress-bar>` | shared component; indeterminate is a `@keyframes` sweep on left/right |
| `<mat-tab-group>` | `div.tabs` + `button.tab` driven by a `signal` and `@switch` |
| `<mat-expansion-panel>` | `div.panel` + `button.panel-header` + `@if` |
| `<mat-table>` | plain `<table class="data-table">` |
| `<mat-toolbar>` | a frame class per position, never one generic `.toolbar` |
| `<mat-sidenav-container>` | flex row: `aside` + content column; `over` mode is a positioned class plus a backdrop div |
| `<mat-icon>x</mat-icon>` | `<span class="icon">x</span>`; the Material Icons **font** is a Google font and can stay in `index.html` |
| `matTooltip` | CSS-only `.tip` using `content: attr(data-tip)` on `::after` |
| `MatSnackBar` | signal-based service + a small component in the shell |
| `MatDrawerMode` | local `export type DrawerMode = 'over' \| 'side'` |
| `BreakpointObserver` | `window.matchMedia(...)`, guarded |
| `CdkTextareaAutosize` | usually unnecessary; a flex-filling textarea is better (see below) |

Name the toolbar classes by position (`topbar`, `page-header`, `app-toolbar`), never `.toolbar`:
component SCSS in these apps frequently already defines `.toolbar` for a local button row, and a
global `.toolbar` collides with it in a way that only shows up as a stray background colour.

## Fill-height chains

Getting an editor or preview to use the available height failed three ways before it worked:

- `min-height: 100%` on the card lets it grow past the pane (measured 1405px inside a 393px pane)
- `height: 100%` alone collapses the inner editor to 0 when the pane is short
- `height: 100%` on the textarea itself never resolves at all

The working shape:

```scss
:host { display: block; height: 100%; min-height: 22rem; }   /* floor keeps it usable when short */
.card { display: flex; flex-direction: column; height: 100%; }
.card-content { flex: 1; min-height: 0; overflow: auto; }
:host(app-editor) { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.leaf-textarea { flex: 1; min-height: 0; }                    /* never a percentage height */
```

Every link in the chain needs `min-height: 0`, or a flex item refuses to shrink below its content.

## Guard `matchMedia`

Replacing `BreakpointObserver` compiles and runs in the browser, then breaks every TestBed spec that
instantiates the service: the test DOM has no `matchMedia`. The same guard makes it SSR-safe.

```ts
constructor() {
  if (typeof window.matchMedia !== 'function') return;
  const query = window.matchMedia('(max-width: 959.98px)');
  ...
  inject(DestroyRef).onDestroy(() => query.removeEventListener('change', listener));
}
```

## The sweep is not done when the build passes

`ng build` succeeding proves the components compile. It says nothing about:

- **e2e selectors**: `mat-icon`, `mat-card-title`, `mat-label`, `[mattooltip]`, `input[matinput]`,
  `mat-slide-toggle` all appear in Playwright specs and all break silently.
- **markdown or docs** shipped with the app: code samples showing `mat-stroked-button`.
- **fixture data** naming Material as a topic or skill.

The finish line is an empty result from

```bash
grep -rn "mat-\|Mat[A-Z]\|@angular/material\|@angular/cdk" src e2e public
```

## Accessibility regressions the migration introduces

Material supplies a lot of accessibility that hand-rolled markup does not. Run axe-core over every
route afterwards. The violations that appeared, and their fixes:

| axe rule | Cause | Fix |
|---|---|---|
| `landmark-one-main`, `region` | no `<main>` once `mat-sidenav-content` is gone | wrap the outlet in `<main>` |
| `page-has-heading-one` | Material card titles were never headings | one `sr-only` `<h1>` in the shell, bound to the router title |
| `landmark-unique` | two `<nav>` elements | distinct `aria-label` on each |
| `heading-order` | `.card-title` as a `div`, sections as `<h4>` | `h2.card-title`, sections `<h3>` |
| `label` | toggle/checkbox with no visible text | `aria-label` input on the shared toggle component |
| `scrollable-region-focusable` | any `overflow: auto` box | `tabindex="0"` + `role="region"` + label |
| `color-contrast` | see below | see below |

Contrast is the one that needs numbers rather than judgement. White text on Material Blue 600
(`#1e88e5`) is **3.68:1** and fails AA; `#1976d2` is **4.63:1** and passes. A translucent active
state such as `bg-white/15` over that blue composites to `#3c8bd9` at 3.56:1 and also fails, so use
a solid darker token instead. Replace `opacity: 0.5/0.6` muted text with an explicit `#64748b`.

Adding the `sr-only` `<h1>` will break `getByText()` assertions that were previously unique. Scope
them to a container.

## Verify by measuring, not by looking

Two defects in this migration were invisible on screen and obvious in numbers:

- A loading bar rendered `rgb(25,118,210)` on top of a `rgb(25,118,210)` topbar. It worked perfectly
  and could not be seen.
- Two header rows that should have formed one continuous rule sat 16px apart (bottom borders at
  y=112 and y=96) because one was `--toolbar-big` and the other `--toolbar-medium`.

Read back `getBoundingClientRect()` and `getComputedStyle()` for both layers of any overlay, and for
any two edges that are supposed to align. See [chrome-devtools](../../chrome-devtools/SKILL.md) for
driving that measurement.
