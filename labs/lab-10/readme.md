# Measure the Workbench and Gate What You Fixed

Nine labs of features have never been measured once. Nobody knows what the bundle costs, what a
list of two thousand secrets does to the browser, or whether the masked value control that was
built for accessibility actually passes an audit. In this lab you measure all three, fix what the
measurements find, and put the checks on the pull request so the next change cannot quietly undo
them.

------

Work in [`l10-secrets-vault-starter/`](./l10-secrets-vault-starter/). Run `claude` from the
repository root and `npm` commands in the app folder. The finished result is in
[`l10-secrets-vault-solution/`](./l10-secrets-vault-solution/).

```bash
cd labs/lab-10/l10-secrets-vault-starter
npm install
npm start
```

---

## Step 1: Turn the current size into a budget that can fail

Overview: a budget set above the current size does nothing, and one set below it breaks the build
on day one. The useful number is a small margin over today's measurement, and the only way to
trust it is to watch it fail once on purpose.

Recipe:

```text
Run npm run build and read the initial total from the output. Then replace the budgets in the
production configuration in angular.json with three: an initial budget warning slightly above today's
size and erroring a little above that, the anyComponentStyle budget that was already there, and a
bundle budget named secrets-page for the lazy route chunk.

Then prove the gate works: lower the initial budget below the measured size, run the build again,
report both the warning and the error line verbatim, and put the real numbers back.
```

Expected Outcome: the build reports the size, and the deliberately low budget produces both a
warning and a build error:

```text
Initial total  338.38 kB
WARNING  bundle initial exceeded maximum budget. Budget 300.00 kB was not met by 38.38 kB
ERROR    bundle initial exceeded maximum budget. Budget 320.00 kB was not met by 18.38 kB
```

---

## Step 2: Virtual-scroll the row list

Overview: the row list renders every secret in the list, and each row carries a masked value
control and an overflow menu. That is fine for seven rows and it is a stalled browser at two
thousand.

Research:

```text
The secrets list renders one app-secret-row per visible secret inside a plain div. Each row is a
component with a projected menu. Compare three ways to keep it fast at 2000 rows: the @for block
as it stands, cdk-virtual-scroll-viewport with cdkVirtualFor, and paging the API.

Say what each does to the row count in the DOM, what each needs from the row's height, and what
each costs a keyboard user who tabs through the list. Then tell me which one this app should use
and what its itemSize has to be.
```

Finding: the answer must say that `cdkVirtualFor` renders only the visible window plus a buffer,
that it requires a fixed row height passed as `itemSize`, and that the viewport needs a bounded
height or nothing scrolls. The height has to be measured, not guessed: a wrong `itemSize` leaves
gaps or clips rows. Paging is the wrong answer here because the API already filters server side
and the user expects one continuous list.

Recipe:

```text
Replace the @for over the rows in secrets-list.html with a cdk-virtual-scroll-viewport carrying
itemSize 61, role list and an aria-label naming the count, and a *cdkVirtualFor over
store.visibleSecrets() with a trackBy on secretId and role listitem on each row. Import
CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll and CdkVirtualForOf from
@angular/cdk/scrolling.

Give the viewport a bounded height in the stylesheet, min(60vh, 610px), replacing the flex column
rules it had.
```

Expected Outcome: the list scrolls inside its own viewport and the DOM holds a window rather than
the whole list. The count line still reports both numbers, and the row count in the accessibility
tree is the rendered window, not the loaded total.

---

## Step 3: Defer what is below the fold

Overview: the vault upload bar loads a component, a retry operator and a progress element for
every vault list, whether or not the user scrolls to it. `@defer (on viewport)` is the cheapest
trigger for something that is on screen but not yet needed.

Recipe:

```text
Wrap the app-vault-upload element in secrets-page.html in a @defer (on viewport) block with a
@placeholder (minimum 100ms) holding one muted line saying the upload bar loads when it scrolls
into view. Style the placeholder from the tokens.
```

Expected Outcome: opening a vault list shows the placeholder line first and swaps it for the
upload bar, and the build reports the upload code in its own chunk rather than in the route
chunk.

---

## Step 4: Audit the accessibility instead of assuming it

Overview: lab 3 built the chip strip and the overflow menu on `@angular/aria` precisely so this
step would pass. It does not, and the thing that fails is the one nobody looks at: the color the
design system chose for small text.

```bash
npm install -D @axe-core/playwright
```

Recipe:

```text
Write e2e/accessibility.spec.ts with three tests: the login screen has no violations, the signed-in
workbench has no violations, and the reveal button reports aria-pressed false and then true.
Configure AxeBuilder with the wcag2a, wcag2aa, wcag21a, wcag21aa and wcag22aa tags and assert
that violations is an empty array.

Run it, read the violation, and fix it at the token level: add a --color-accent-text custom
property to styles.css that is light enough to pass 4.5:1 on the card background, comment why it
exists, and switch every "color: var(--color-accent)" rule in the components to it. Leave borders
and backgrounds on the original accent.

Also give the count line role status and aria-live polite, so filtering announces its result.
```

Expected Outcome: the first run reports one contrast violation on the accent-colored count and
the second run is clean:

```text
before   color-contrast  wcag2aa  target: .card .count
after    3 passed
```

---

## Step 5: Score the page and gate the pull request

Overview: Lighthouse checks the things a unit test cannot see, and two of its failures here are
one-line fixes that no amount of component testing would have surfaced.

Recipe:

```text
Run a Lighthouse navigation audit against http://localhost:4200/login using the chrome-devtools
MCP server and report every failing audit id with its title.

Fix both: give index.html a meta description naming the product, and replace the login card's
section element with main so the page has a main landmark. Re-run the audit and report the four
category scores.

Then write .github/workflows/quality-gate.yml, triggered on pull requests touching this lab's
app folder. It checks out, sets up Node 22, runs npm ci, npm run build (the budgets from step 1
are the size gate), npx ng test --watch=false, starts the vault container, installs the Playwright
chromium browser and runs npx playwright test (the axe suite from step 4 is the accessibility
gate). Comment the two steps whose purpose is not obvious from the command. Use no backticks and
no command substitution anywhere in the file: a workflow that interpolates shell into a YAML
string runs it on the runner.
```

Expected Outcome: the two failing audits disappear and the page scores full marks:

```text
before   landmark-one-main (0), meta-description (0)   Accessibility 96  SEO 90
after    Passed: 40, Failed: 0                          Accessibility 100 SEO 100
```

The workflow file is not executed here: it needs a GitHub runner. Its shape is verified instead,
by confirming it contains no backticks and no command substitution and that every step's working
directory is the app folder.

---

## Next

Lab 11 decides which of these routes should render on the server at all: a credential detail page
is the clearest case in the course of something that must never be server-rendered.
