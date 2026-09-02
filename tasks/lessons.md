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

## Playwright reuses whatever server is already on the port, even a different app

**Pattern:** `playwright.config.ts` sets `webServer.reuseExistingServer: true` on port 4200. The `03-components`
demo was already serving there, so the customers suite drove that app instead: 22 failures that read like broken
specs. Three runs and ~20 minutes went into the wrong hypothesis.
**Rule:** In a repo of 12 demo apps that all default to 4200, check the port before believing a mass e2e failure
(`Get-NetTCPConnection -LocalPort 4200 | ... Win32_Process`), and run with the config's `PW_PORT` override. The
answer was already in the first failure: `test-results/<test>/error-context.md` carries the page snapshot, and it
showed another app's `<h1>`. Read that file before re-running anything.

## `ng serve` reads environment.development.ts, not environment.ts

**Pattern:** To verify the e2e suite against a json-server on another port, `environment.ts` was repointed and the
run still hit the dead one: the table rendered empty while curl against the new API returned four customers.
`angular.json` has a `fileReplacements` entry swapping in `environment.development.ts` for the dev build.
**Rule:** Before changing an API base for any dev-server run, `grep -n fileReplacements -A 4 angular.json` and edit
every file the active configuration can substitute. Symptom of getting it wrong: the page renders, the API answers
curl, and the component shows nothing.

## json-server assigns its own ids and ignores the ones you post

**Pattern:** The e2e fixture seeds `{ id: 1, name: 'Cleo' }`; json-server 1.x stored it as `"id": "LeCV0Aj1W-U"`.
A spec asserting `r.url() === ${API}/customers/1` timed out, and `nextId()` in the store reduces over those ids.
**Rule:** Never assert a server-assigned id in an e2e spec. Match the request by method plus a URL prefix, and
assert the payload fields you actually sent (`toMatchObject({ name: 'Cleo Renamed' })`). Pairs with the db.json
rewrite lesson above. The same churn makes the delete-and-reseed fixture non-idempotent: one run in four seeded
3 of 4 customers, and the missing row surfaced as a failing *delete* test. A reset that loses a POST looks like
an app bug.


## The app frame ports verbatim; only the samples need judgement

**Pattern:** Rolling module 06's Tailwind frame out to ten sibling demo apps looked like ten migrations. It was
one deterministic copy plus ten small ones. The whole shell (`src/app/shared/{navbar,sidenav,side-panel,intro,
loading,snackbar,markdown-renderer,markdown-editor,progress-bar,slide-toggle,layout,services,theme,
request-status,formatting}`, `demos/demo-container`, `app.component.*`, `src/theme/*`, `tailwind.css`,
`styles.scss`, `index.html`) is entirely data driven: nav items come from `db.json` `top-links`, the demo list
from `demos`, the title from `environment.title`. Nothing in it names a module. Only `demos/samples/**` and the
module's own feature folders carry module-specific markup.
**Rule:** Before fanning agents out over a repeated migration, find the boundary between what copies byte for byte
and what needs judgement, and keep the copy on the main thread. `cp -r` from the reference is exact and free;
an agent asked to "recreate the shell" is neither. Fan out only over the judgement half, one agent per group of
sample folders, and give each a build/verify agent afterwards.

## Removing Angular Material is not removing @angular/cdk

**Pattern:** The handoff prescribed `npm uninstall @angular/material @angular/cdk` for every app. In module 03 that
broke the build with three unresolved imports from `@angular/aria/{listbox,tabs}`: `@angular/aria` declares a hard
peer dependency on `@angular/cdk`, so removing the CDK broke a demo that never touched Material. Module 04 hit the
same through `@angular/aria/combobox`, and module 09's `virtual-scroll` demo imports `CdkVirtualScrollViewport`
from `@angular/cdk/scrolling` as its entire teaching point.
**Rule:** Uninstall `@angular/material` always; treat `@angular/cdk` as a separate decision. Before removing it,
`grep -rn "@angular/cdk" src` and check for a peer edge (`npm ls @angular/cdk`). CDK is the substrate under
`@angular/aria`, `cdk/scrolling`, `cdk/overlay` and `cdk/testing`; Material is one consumer of it, not its owner.
Three of eleven apps here legitimately keep it.

## `npx vitest run` is the wrong runner in an @angular/build workspace

**Pattern:** Checking a module after the frame port, `npx vitest run` reported 9 failed files and 23 failed tests
with `Need to call TestBed.initTestEnvironment() first` and `setup 0ms`. Nothing was broken. The workspace uses the
`@angular/build:unit-test` builder, whose `setupFiles` and TestBed environment are wired by `ng test`; invoking
vitest directly skips all of it. The same false alarm reappeared inside a subagent report for another module.
**Rule:** Run `npx ng test` (or `npm test`, which maps to it). A mass failure whose message is about TestBed not
being initialised, or `localStorage is not defined`, or an unresolved `templateUrl`, is the runner, not the code.
Check `angular.json` `architect.test.builder` before believing a red suite.

## A copied frame carries the reference app's environment contract

**Pattern:** Module 06's `app.component.ts` imports `../environments/environment.development`. Copying it into
module 01 broke `app.component.spec.ts`, which asserts against `environment.ts`: the app read
`'Agentic Angular Engineering (dev)'` and the spec expected `'Agentic Angular Engineering'`. Module 09 was worse:
it has no `environment.development.ts` at all, using `environment.ts` plus `environment.prod.ts` with an inverted
`fileReplacements`, so the copied file did not compile.
**Rule:** A shell file that imports a specific environment file is a contract, not an implementation detail. After
copying a frame, reconcile the target's environment convention first: same file names, and the same value for any
key the frame reads in both dev and prod. A spec comparing against `environment.title` is the cheapest detector.

## `rm -rf` before `cp -r` deletes the files only that copy had

**Pattern:** Replacing each module's `shared/markdown-editor` with the reference version was done as
`rm -rf <dir> && cp -r <ref> <dir>`. Module 01 was the only one carrying `markdown-editor.store.spec.ts`; the
delete took it and the copy did not put it back. It surfaced only as `git status` showing a lone ` D ` line among
350 ` M ` lines.
**Rule:** When replacing a directory wholesale, `diff -rq <ref> <target>` first and read the "Only in target"
lines: those are the files about to be lost. Recover with `git show HEAD:<path> > <path>`, never
`git checkout --`. And read `git status` for deletions after any bulk directory operation, not just for
modifications.

## A build that passes and tests that pass still miss what the browser shows

**Pattern:** Module 04 built clean and passed 24/24 after migration. Opening `/demos/validation` in a browser showed
the guide markdown rendered twice: 22 of its 23 samples embed `<app-markdown-renderer [md]="'...'"/>` at the top of
their own template, duplicating the guide the shell's split pane already renders. Verified: the inline `[md]` was
byte-identical to `db.json`'s `md` field in all 22. No compiler or spec could see it. The same run found
`[boxed]` computing `height: 100px` against 120px of content, so a button painted over the text of the next box.
**Rule:** For a UI migration, the build and the suite are necessary and not sufficient. Open the app and measure:
`getBoundingClientRect()` against `scrollHeight` catches clipping, and a second look at a route catches duplicated
or missing regions. Budget one browser pass per module, not one per repo.

## A demo whose subject is the library you are removing is the user's call

**Pattern:** Module 08 (testing) had three surfaces built entirely on Angular Material component harnesses: a
`material` demo, a `browser-mode-harnesses` demo and `customers-table.harness.spec.ts`. Uninstalling Material
deletes the lesson, not just the styling. The migration brief had no answer for this and picking one silently would
have either broken the module or quietly rewritten its curriculum.
**Rule:** In a teaching repository, separate "code that uses X" from "code that teaches X". The first is migration
work; the second is a curriculum decision that goes back to the owner with the options priced (keep the dependency
for those demos, rewrite them against the replacement, or drop them). Ask before the sweep reaches them, not after.
