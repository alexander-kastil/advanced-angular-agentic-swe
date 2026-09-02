# Handoff: aligning the remaining demo modules to the Tailwind frame

Module `06-ngrx-signals/ngrx-signal-store` is the reference implementation. Angular Material and
`@angular/cdk` are gone from it, Tailwind v4 replaces them, and the app shell was rebuilt. The other
ten demo apps still ship Material. This document is what a follow-up run needs to repeat the work
without rediscovering the traps.

Reference app: `demos/06-ngrx-signals/ngrx-signal-store`
Reference commits: `10a82eb` (material removal) and `9415644` (ui). Read the diff with
`git diff 8c27583..9415644 -- demos/06-ngrx-signals` — that range is the whole migration.
State: build clean, 51/51 unit tests pass, 59/61 e2e pass (2 known, listed at the end), axe-core
reports 0 violations across 20 routes.

## Modules still on Material

| Module | App folder |
|---|---|
| 01-agentic-dev | `ng-agentic` |
| 02-signals | `ng-signals` |
| 03-components | `ng-components` |
| 04-signal-forms | `ng-signal-forms` |
| 05-reactive | `ng-reactive` |
| 07-routing-app-init | `routing-app-init` |
| 08-testing | `vitetest-testing` |
| 09-performance-compliance | `optimize-angular` |
| 10-ssr | `food-shop-ssr` |
| 11-agentic-devops | `ng-agentic-devops` |

`10-ssr` needs extra care: SSR renders without a DOM, so anything touching `window` must be guarded
(see "matchMedia" below).

## Step 1 — install and wire Tailwind

```bash
cd demos/<module>/<app>
npm install -D tailwindcss @tailwindcss/postcss postcss
npm uninstall @angular/material @angular/cdk
```

Create `.postcssrc.json` in the app root:

```json
{ "plugins": { "@tailwindcss/postcss": {} } }
```

Copy `src/tailwind.css` from module 06 verbatim. It is the single source of truth for tokens and the
component vocabulary. Register it in `angular.json` **before** `styles.scss`:

```json
"styles": [
  "src/tailwind.css",
  "src/styles.scss",
  ...
]
```

Order matters. Tailwind emits into cascade layers; unlayered rules in `styles.scss` and component
SCSS therefore always win, which is what lets per-component overrides keep working.

## Step 2 — strip the Material theme files

Delete `src/theme/mat-theme.scss` and `src/theme/mat-overrides.scss`, and drop their `@use` lines
from `src/styles.scss`.

**Trap:** most of these apps have a `src/theme/resets.scss` containing

```scss
* { margin: 0; padding: 0; border: 0; font-size: 100%; ... }
```

That `border: 0` is unlayered, so it overrides every Tailwind `border` utility and silently removes
all borders across the app. Replace the whole file with `body { margin: 0; }` — Tailwind preflight
already does the rest properly.

Also strip `mat-form-field` / `mat-*` rules out of `src/theme/forms.scss`.

## Step 3 — component vocabulary

`tailwind.css` defines these. Use them instead of inventing per-component styles.

Frame: `topbar`, `topbar-link`, `topbar-link-active`, `rail`, `rail-brand`, `rail-label`,
`rail-footer`, `rail-right`, `rail-btn`, `rail-btn-active`, `page-header`, `app-toolbar`, `page`.

Surfaces: `card`, `card-header`, `card-title`, `card-subtitle`, `card-content`, `card-actions`,
`panel`, `panel-header`, `panel-title`, `panel-content`, `modal`.

Controls: `btn` + `btn-primary` / `btn-outline` / `btn-warn`, `btn-icon`, `btn-fab`, `field`,
`label`, `input`, `textarea`, `switch` + `switch-track` + `switch-thumb`, `checkbox`,
`toggle-group` + `toggle-btn`, `tabs` + `tab`, `nav-list` + `nav-item` + `nav-item-active`,
`data-table`, `progress`, `tip` / `tip-left`, `icon`.

Utility: `no-scrollbar` (declared with `@utility`, not `@layer components` — see traps).

### Material to Tailwind mapping

| Material | Replacement |
|---|---|
| `<mat-card>` + parts | `div.card` / `.card-header` / `h2.card-title` / `.card-content` / `.card-actions` |
| `mat-raised-button` / `mat-flat-button` | `class="btn btn-primary"` |
| `mat-stroked-button` | `class="btn btn-outline"` |
| `mat-icon-button` | `class="btn-icon"` |
| `mat-mini-fab` | `class="rail-btn"` (frame) or `class="btn-fab"` |
| `<mat-form-field>` + `<mat-label>` + `matInput` | `div.field` + `label.label` + `input.input` / `textarea.textarea` |
| `<mat-slide-toggle>` | `<app-slide-toggle>` (shared component) |
| `<mat-checkbox>` | `label.checkbox` wrapping a native `input[type=checkbox]` |
| `<mat-button-toggle-group>` | `div.toggle-group` + `button.toggle-btn` with `[class.active]` |
| `<mat-progress-bar>` | `<app-progress-bar>` (shared component) |
| `<mat-tab-group>` | `div.tabs` + `button.tab` driven by a `signal` |
| `<mat-expansion-panel>` | `div.panel` + `button.panel-header` + `@if` content |
| `<mat-table>` | plain `<table class="data-table">` |
| `<mat-toolbar>` | `.topbar` / `.page-header` / `.app-toolbar` depending on position |
| `<mat-sidenav-container>` | flex layout: `aside.rail` + content column, `over`/`side` via a class |
| `<mat-icon>x</mat-icon>` | `<span class="icon">x</span>` (Material Icons font link in `index.html` stays; it is a Google font, not part of the package) |
| `matTooltip="x"` | `class="tip"` + `data-tip="x"` (add `tip-left` on right-hand rails) |
| `MatSnackBar` | `SnackbarService` signal + `<app-snackbar />` in the shell |
| `MatDrawerMode` | local `export type DrawerMode = 'over' \| 'side'` |
| `BreakpointObserver` | `window.matchMedia('(max-width: 959.98px)')` |
| `CdkTextareaAutosize` | drop it; use a flex-filling textarea (see the editor section) |

### Shared components to copy

From `src/app/shared/` in module 06:

- `progress-bar/progress-bar.component.ts` — `mode` (`indeterminate` \| `determinate`) + `value`
- `slide-toggle/slide-toggle.component.ts` — `checked`, `disabled`, `aria-label`, `(toggled)`
- `snackbar/snackbar.component.ts` + the rewritten `snackbar.service.ts`
- `loading/loading.component.*` — the spheric wave indicator

## Step 4 — the app shell

The frame is a grid: `--toolbar-big` (56px) top row, content below.

- **Top nav** (`navbar.component.html`): `nav.topbar` with `aria-label="Main"`, links as
  `a.topbar-link` with `routerLinkActive="topbar-link-active"`, then `<app-loading />` filling the
  free space, then the apps button. `.menuContainer` must be `flex: 0 0 auto` or it eats the space
  the loader needs.
- **Left rail** (`demo-container.component.html`): `aside.rail` with `.rail-brand` (56px, holds the
  collapse chevron), `nav.nav-list` with `aria-label`, and `.rail-footer` pinned with `margin-top:
  auto`. Collapsing sets `.rail-collapsed` (48px) and hides the labels; the chevron stays visible so
  there is always a way back.
- **Page header**: `.page-header` must be `height: var(--toolbar-big)`, not `--toolbar-medium`.
  Measured: at 40px the rail's bottom border sits at y=112 and the header's at y=96, so the two
  rules never line up. At 56px both land on y=112 and read as one continuous line across the frame.
- **Right rail**: `.rail-right` with `.rail-btn` buttons, each carrying both `aria-label` and
  `data-tip` (the tooltip is CSS-only, the label is what tests and screen readers use).

### Loading indicator

`LoadingComponent` lives **in the top nav**, not the shell. It is the spheric wave ported verbatim
from `D:\git-customers\rahimi-carpets\src\carpets-ui` (`src/app/carpet-visualizer/theme/stage.css`,
`.cv__gen-dots`): twelve 5px spheres on a 0.18s stagger plus a 7px endpoint sphere, `gen-wave` and
`gen-endpoint` keyframes at 3.6s, with a `prefers-reduced-motion` fallback. Only the colour differs
(white, for the blue bar).

Two things were wrong before and must not be reintroduced:

1. `loadingInterceptor` already tracks every HTTP request and sets a global signal, but
   `LoadingComponent` was **never rendered anywhere**, so the indicator never fired. Render it.
2. The first replacement bar was `#1976d2` positioned on top of the `#1976d2` topbar — invisible.
   Measure the composed colours, do not eyeball them.

The component holds the indicator for a 400ms minimum (`MIN_VISIBLE_MS`) so fast localhost responses
still register visually. All backend access in these apps goes through `HttpClient`, so the
interceptor covers everything including `httpResource` and ngx-markdown's `[src]` fetches — verify
with `grep -rn "fetch(" src` before assuming.

## Step 5 — accessibility

axe-core 4.10 (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice`) must report
zero violations. The ones that will appear if you skip these:

- **`landmark-one-main` / `region`**: wrap the router outlet in `<main class="gdMainrow">`.
- **`page-has-heading-one`**: one `<h1 class="sr-only">` in the shell, bound to the router title.
- **`landmark-unique`**: two `<nav>` elements need distinct `aria-label`s (`Main`, `Demos`).
- **`heading-order`**: card titles are `<h2 class="card-title">`, section headings inside cards are
  `<h3>`. A bare `<h4>` under an `<h1>` fails.
- **`label`**: `<app-slide-toggle>` and bare checkboxes used without visible text need an
  `aria-label` (`[aria-label]="'Completed: ' + row.name"`).
- **`scrollable-region-focusable`**: every `overflow:auto` box needs `tabindex="0"` plus
  `role="region"` and a label — the code `<pre>` blocks and `.panel-content` in particular.
- **`color-contrast`**: white text needs `--color-primary: #1976d2` (4.63:1). The old `#1e88e5` is
  3.68:1 and fails. Do not use `bg-white/15` for the active nav pill — it composites to `#3c8bd9`
  (3.56:1); use `bg-primary-dark`. Replace `opacity: 0.5/0.6` muted text with an explicit `#64748b`.

Run the audit by injecting axe from CDN in a driven browser and walking the routes; module 06's run
covered 20 routes including `/skills/new` and `/customers/1`.

## Step 6 — e2e specs

Selector mapping applied to `e2e/*.spec.ts`:

| Old | New |
|---|---|
| `mat-icon` | `.icon` |
| `mat-card-title` | `.card-title` |
| `mat-label` | `label[for="..."]` |
| `mat-slide-toggle` | `app-slide-toggle` |
| `input[matinput]` | `input.input` |
| `textarea[matinput]` | `textarea.textarea` (editor: `textarea.md-source`) |
| `[mattooltip="X"]` | `[data-tip="X"]` |

`getByText('NgRx')` becomes ambiguous once the shell has an `sr-only` `<h1>` carrying the app title —
scope such assertions to a container (`app-skill-row .name`).

`playwright.config.ts` hardcodes `baseURL: http://localhost:4200`. Serve on 4200 for the run.

## Traps that cost time here

- **`@apply` only takes utilities.** `@apply btn` inside `.btn-primary`, or `@apply no-scrollbar`,
  fails with *"Cannot apply unknown utility class"*. Compose in the template (`class="btn
  btn-primary"`) or declare the helper with `@utility name { ... }` at top level.
- **`peer` cannot be applied.** Put `class="peer"` directly on the element; only variants like
  `peer-checked:bg-primary` work through `@apply`.
- **Tailwind preflight zeroes `<dialog>` margins**, so `showModal()` no longer centres. Set
  `margin: auto` explicitly on the dialog class.
- **A modal route must be a child route.** `/skills/new` as a sibling replaced the list and left an
  empty page behind the backdrop. Nest it under the list component and add a `<router-outlet />`
  there.
- **`window.matchMedia` is undefined in the unit-test DOM.** Guard the `SideNavService` constructor
  (`if (typeof window.matchMedia !== 'function') return;`) or 7 specs fail. Same guard covers SSR.
- **Fill-height chains need `height: 100%` on the container and `flex: 1; min-height: 0` on the
  child.** `min-height: 100%` lets the card grow past the pane (measured 1405px in a 393px pane);
  `height: 100%` alone collapses the editor to 0 in a short pane. The working combination is
  `:host { height: 100%; min-height: 22rem }` on the container, `flex` column card, and
  `flex: 1; min-height: 0` on the textarea/preview. `height: 100%` on the textarea does not resolve.
- **`.toolbar` is a real class name in the sample SCSS.** The global frame class is `app-toolbar`
  precisely to avoid colliding with it.
- **json-server rewrites `db.json` on every write**: numeric ids become strings and a `$schema` key
  is injected. Any e2e run or manual click that POSTs/DELETEs will dirty the fixture. Check
  `git diff db.json` afterwards and restore. The skills e2e mocks its API with `page.route` and does
  not touch the file; other specs may.

## Content that goes stale with the refactor

- `public/markdown/*.md` guides: one snippet in `store-events.md` showed `mat-stroked-button`.
  Grep each module's guides for `mat-`, `Mat[A-Z]`, `@angular/material`, `@angular/cdk`.
- `db.json` demo data: module 06's `skills` and `topics` were modernised (`RxJs` → `Signals`,
  `Material` → `Tailwind`, added `Agentic Engineering`). Apply the same renames where the other
  modules carry the same rows.
- `src/theme/markdown.scss`: the rendered markdown was 16px against the app's 14px. Module 06's file
  now sets the whole markdown scale (body 0.875rem/1.6, h1 1.125rem down to h4 0.875rem, code
  0.8125rem, tables, blockquotes, links). Copy it.

## Known open items in module 06

Two e2e specs still fail, both asserting split-pane behaviour rather than markup:

1. `demo-layouts.spec.ts` — `close editor hides pane and restores edit_square icon`. Fixed by
   changing `LayoutStore.toggleEditor()` to clear `markdownPaneVisible` when leaving editor mode.
   Re-verify in the next run.
2. `demo-layouts.spec.ts` — `demoPaneSize persists after drag and guide toggle`. The synthetic
   gutter drag never writes `demoPaneSize` to `localStorage`. Unresolved; needs a look at
   `onSplitDragEnd` against `angular-split`'s `dragEnd` payload.

`AutosizeDirective` was written as the `CdkTextareaAutosize` replacement, then made redundant when
the markdown editor switched to filling by flex. It has been deleted. Do not port it into the other
modules — replace `cdkTextareaAutosize` with the flex chain described above.
