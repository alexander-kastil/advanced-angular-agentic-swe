# Lessons

## Tailwind v4 in Angular: the `*` reset silently deletes every border

**Pattern:** Every demo app carries `src/theme/resets.scss` with `* { margin:0; padding:0; border:0; font-size:100% }`.
Tailwind emits its utilities into cascade layers, and unlayered rules always beat layered ones regardless of
specificity. After wiring Tailwind, `border`, `border-b` and friends produced no border anywhere, with no error.
**Rule:** When adding Tailwind to an existing Angular app, delete the `*` reset before anything else. Preflight
already handles margins and box-sizing correctly. Keep `body { margin: 0 }` and nothing more.

## `@apply` only accepts utilities, never your own component classes

**Pattern:** `@apply btn` inside `.btn-primary`, and `@apply no-scrollbar`, both failed the build with
*"Cannot apply unknown utility class"*. The same is true of `peer`, which is a marker class rather than a utility.
**Rule:** Compose component classes in the template (`class="btn btn-primary"`). If a helper genuinely needs to be
`@apply`-able, declare it with `@utility name { ... }` at top level, not inside `@layer components`. Put `peer`
directly on the element.

## Tailwind preflight breaks native `<dialog>` centring

**Pattern:** `showModal()` normally centres a dialog through the UA's `margin: auto`. Preflight zeroes it, so the
modal rendered flush in the top-left corner.
**Rule:** Any `.modal` class built on `<dialog>` must set `margin: auto` explicitly. Native `<dialog>` is still the
right choice: it brings focus trap, Esc, and an inert background for free.

## A modal route has to be a child route

**Pattern:** `/skills/new` was a sibling of the list route, so opening the "modal" unmounted the list and left an
empty page behind the backdrop.
**Rule:** Nest the editor route under the list component and put a `<router-outlet />` there. A dialog that replaces
its own background is not a dialog.

## Fill-height chains: `height: 100%` on the container, `flex: 1; min-height: 0` on the child

**Pattern:** Making the markdown editor use the available height took three wrong attempts. `min-height: 100%`
let the card grow to its content (measured 1405px inside a 393px pane). `height: 100%` alone collapsed the editor
to 0 in a short pane. `height: 100%` on the textarea itself never resolved at all.
**Rule:** Container gets `height: 100%` plus a `min-height` floor so it stays usable in a short pane; every
descendant in the chain gets `flex: 1; min-height: 0`; the leaf textarea or preview gets `flex: 1; min-height: 0`,
never a percentage height. Verify by measuring the boxes, not by looking.

## Measure the composed colour before believing a control is visible

**Pattern:** The replacement loading bar rendered `rgb(25,118,210)` positioned on top of the `rgb(25,118,210)`
topbar. It was working the whole time and completely invisible. Separately, `bg-white/15` for the active nav pill
composited to `#3c8bd9`, which fails contrast at 3.56:1 even though the token was "white".
**Rule:** For any overlay or translucent surface, read back the computed colour of both layers in the browser and
compare. Never reason about `white/15` as if it were white.

## An interceptor that sets a loading flag does nothing if the indicator is never rendered

**Pattern:** `loadingInterceptor` correctly tracked every request and drove a signal. `LoadingComponent` existed,
compiled, and was imported nowhere. The app had shipped with a dead loading indicator.
**Rule:** When wiring global feedback, grep for the component selector before assuming the feature works. Also give
such an indicator a minimum visible duration (400ms here) or localhost responses finish before a frame renders.

## Guard `window.matchMedia` when it replaces `BreakpointObserver`

**Pattern:** Swapping the CDK `BreakpointObserver` for `window.matchMedia` compiled and ran fine in the browser and
broke 7 unit tests at once: the test DOM has no `matchMedia`.
**Rule:** Guard the constructor (`if (typeof window.matchMedia !== 'function') return;`). The same guard is what
makes the service SSR-safe, which module 10 will need.

## Refactors invalidate e2e selectors and the guides, not just the components

**Pattern:** After the component sweep the app built and unit-tested clean, and 12 Playwright specs still queried
`mat-icon`, `mat-card-title`, `[mattooltip]` and `input[matinput]`. A markdown guide still showed a
`mat-stroked-button` snippet in its code sample.
**Rule:** A framework removal is done when `grep -rn "mat-\|Mat[A-Z]\|@angular/material" src e2e public` is empty,
not when the build passes. Sweep tests and docs in the same pass as the components.

## Adding an sr-only `<h1>` breaks `getByText` assertions

**Pattern:** The a11y fix for `page-has-heading-one` put a visually hidden `<h1>` carrying the app title into the
shell. `getByText('NgRx', { exact: true })` then matched two elements and the spec failed on strict mode.
**Rule:** Scope text assertions to a container (`app-skill-row .name`) rather than the page. Expect accessibility
additions to be visible to the test runner even when invisible on screen.

## json-server rewrites db.json on every write

**Pattern:** One probe DELETE against the running json-server rewrote the whole fixture: numeric ids became
strings and a `$schema` key appeared. The file is checked in.
**Rule:** Any e2e run or manual click that mutates data dirties `db.json`. Check `git diff db.json` afterwards and
restore. Prefer specs that mock the API with `page.route`, the way `skills.fixtures.ts` does.

## Design-system generators can answer the wrong question

**Pattern:** `ui-ux-pro-max --design-system` returned a dark OLED re-theme for a polish request on an app whose
palette the user had explicitly asked to keep.
**Rule:** Verify a generated design system against the constraints already stated in the conversation before
applying any of it. For a polish pass on an existing app, use focused `--domain` searches (spacing, nav state,
focus, contrast) instead of the whole-system generator, and say which one you used and why.

## A named reference implementation is copied exactly, including its colours

**Pattern:** Asked for the integrations.at wordmark, the badge was rebuilt with the site's structure but recoloured
for a light background and given a smaller label. The correction was blunt: it should be exactly as it is in
integrations.
**Rule:** When the user names a source, port its CSS values verbatim and give the lockup the ground it was designed
for (here: its own `#2d3436` strip). Fit it by scaling the whole lockup, which preserves every ratio, rather than
by re-picking sizes and colours. "One liner" is a hard constraint: verify all children share one centre line.
