# Migrating an Angular app off Angular Material onto Tailwind v4

Verified end to end on an Angular 22 zoneless app with ~40 Material-using components: build clean,
51/51 unit tests, axe-core 0 violations across 20 routes. Then repeated across ten sibling apps in the same
repo: all eleven off Material, all builds clean, 416 unit tests passing. The single-app material is below;
[Rolling it out to many apps](#rolling-it-out-to-many-apps) carries what only the repeat run taught.

## Wiring

`scripts/material-to-tailwind.sh --wire <app-dir> [--dry-run]` does the deterministic half of this
section (packages, `.postcssrc.json`, style order, the `*` reset). `--verify <app-dir>` is read-only
and reports whether an app is fully off Material and correctly wired; it is the finish-line check for
the sweep described further down.

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss
npm uninstall @angular/material
```

**Do not uninstall `@angular/cdk` reflexively.** Material depends on the CDK; the CDK does not depend on
Material, and other packages sit on top of it. `@angular/aria` declares a *hard peer* on
`@angular/cdk`, so removing it breaks `@angular/aria/{listbox,tabs,combobox}` imports with unresolved
modules that no source edit can fix. `cdk/scrolling`, `cdk/overlay` and `cdk/testing` are likewise
independent of Material. Check first:

```bash
grep -rn "@angular/cdk" src
npm ls @angular/cdk        # shows the peer edges
```

Uninstall it only when both come back empty. Three of the eleven apps in this repo legitimately keep it.

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


## Rolling it out to many apps

Migrating one app teaches the replacement map. Migrating ten more teaches where the boundary is.

### Split the work at the copy/judgement line, not per app

In a repo of sibling apps built from one template, the whole frame is usually **data driven and therefore
verbatim-portable**: nav items come from `db.json`, the demo list from an API, the title from
`environment.title`. Nothing in it names a module. That covers `src/app/shared/**`, the container component,
`app.component.*`, `src/theme/*`, `tailwind.css`, `styles.scss` and `index.html`.

Do that copy yourself, on the main thread, with `cp -r` from the reference app. It is exact and free.
Fan agents out only over what is genuinely per-app: the sample/feature components, plus one build-and-verify
agent per app afterwards. Briefing an agent to "recreate the shell" spends tokens to produce a worse copy.

Keep the per-app config edits scripted rather than delegated too: `package.json` deps, the `angular.json`
styles order and budgets, `db.json` seed rows. They are fidelity work, and a script does eleven apps in one pass.

### The copied frame carries the reference app's environment contract

If the reference `app.component.ts` imports `../environments/environment.development`, every target needs
that file, with the same value for any key the frame reads. Two failure shapes:

- Target has both files but different values, so a spec asserting `environment.title` fails after the copy.
- Target uses the inverted convention (`environment.ts` for dev plus `environment.prod.ts` swapped in by
  `fileReplacements`), so the import does not resolve at all.

Reconcile the environment convention before the frame copy, and let a `environment.title` spec be the detector.

### `rm -rf` before `cp -r` deletes what only the target had

Replacing a shared directory wholesale drops any file unique to that copy (a spec, a local variant).
Run `diff -rq <ref> <target>` first and read the `Only in <target>` lines. Recover with
`git show HEAD:<path> > <path>`, never `git checkout --`. Read `git status` for ` D ` lines after any bulk
directory operation.

### Use the workspace's own test runner

In an `@angular/build` workspace the suite is wired by the `@angular/build:unit-test` builder
(`setupFiles`, the TestBed environment). `npx vitest run` bypasses all of it and reports a wall of
`Need to call TestBed.initTestEnvironment() first`, `localStorage is not defined`, or an unresolved
`templateUrl`. None of it is real. Run `npx ng test`. Check `angular.json` `architect.test.builder` before
believing a red suite, and say so in any agent brief: subagents fall into this too.

### Fixed heights survive the migration and then overlap

A shared directive composing `host: { style: 'height:100px' }` is invisible while Material supplies its own
box, and becomes a defect once the markup is plain: content taller than the box paints over whatever follows.
Measure rather than squint:

```js
[...document.querySelectorAll('[boxed]')].map(el => ({
  h: Math.round(el.getBoundingClientRect().height),
  scroll: el.scrollHeight,
  overflowing: el.scrollHeight > el.getBoundingClientRect().height + 1,
}))
```

The fix is `min-height` plus a real flex column with a gap, never a fixed `height`.

### The build passing is not the finish line, and neither is the suite

Both were green on an app whose every demo rendered its guide twice, because each component embedded the same
markdown renderer the shell already showed. Nothing static could see it. Budget one browser pass per app: open
two routes, compare against the reference app, and measure any two edges that should align.

### Code that *teaches* the library you are removing is a scope decision

A testing module built demos on Material component harnesses; an optimization module taught
`cdk/scrolling`. Removing the dependency deletes the lesson rather than the styling. Separate "uses X" from
"teaches X", and take the second back to the owner with the options priced: keep the dependency for those
demos, rewrite them against the replacement, or drop them. Ask before the sweep reaches them.
