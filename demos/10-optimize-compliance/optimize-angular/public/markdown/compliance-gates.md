# Gate the Pull Request

## Why a gate and not a guideline

Every rule in this module is cheap to state and easy to lose. Bundles grow one dependency at a time, an
`alt` attribute goes missing in a hurried fix, and six months later the audit finds all of it at once.
A gate turns the rule into a merge condition: the check exits non-zero, the run fails, the pull request
cannot be merged.

## The scope boundary

**Module 09 gates the local build.** Everything here runs on a CI runner against the source tree and
against `dist/`. No DNS, no TLS, no deployment, no field data. The question is: *is this artifact allowed
to ship?*

**Module 12 measures Core Web Vitals after deploy.** Same metrics, against a live origin, with the
network and the real users in the picture. The question there is: *what does the shipped artifact do in
the world?*

Do not mix them. A gate that depends on a deployed URL is a gate that fails when the deploy is slow, and
a flaky gate is a disabled gate.

## Gate 1: build budgets

Configured in `angular.json`:

```json
"budgets": [
  { "type": "initial", "maximumWarning": "1MB", "maximumError": "2MB" },
  { "type": "anyComponentStyle", "maximumWarning": "4kB", "maximumError": "8kB" }
]
```

`ng build` prints a warning over `maximumWarning` and **exits 1** over `maximumError`. Keep both set: the
warning makes the number visible in review long before the error blocks anyone.

```
ERROR: bundle initial exceeded maximum budget. Budget 2.00 MB was not met by 140.11 kB.
```

## Gate 2: template accessibility lint

Configured in `eslint.config.js`, in the `**/*.html` block:

```js
rules: {
  '@angular-eslint/template/alt-text': 'error',
  '@angular-eslint/template/elements-content': 'error',
  '@angular-eslint/template/label-has-associated-control': 'error',
  '@angular-eslint/template/table-scope': 'error',
  '@angular-eslint/template/valid-aria': 'error',
  '@angular-eslint/template/role-has-required-aria': 'error',
  '@angular-eslint/template/interactive-supports-focus': 'error',
  '@angular-eslint/template/click-events-have-key-events': 'error',
  '@angular-eslint/template/button-has-type': 'error'
}
```

Note the rule names. `@angular-eslint` 21 dropped the `accessibility-` prefix these rules carried in
earlier versions, and it dropped the legacy `.eslintrc.json` format with it. A config written against
version 17 does not fail loudly on the new major: ESLint 9 simply does not read `.eslintrc.json`, so the
lint target reports success while enforcing nothing. When you inherit a lint gate, the first thing to
verify is that it can still fail.

`ng lint` exits 1 on any of them. This is the cheapest gate in the set: it runs in seconds, it needs no
browser, and it catches the defects that are most annoying to fix later.

The config carries one scoped override, and it is worth reading as an example of how to write one.
`src/app/shared/formatting/formatting-directives.ts` predates the `@angular-eslint/directive-selector`
prefix rule and its directives are used as bare layout attributes across the app shell, so renaming them
would touch every template in the app for a house-style rule that no compliance gate depends on. The
override therefore switches off exactly that one rule, for exactly that one file, and leaves every
accessibility rule in force everywhere. Scope an exception to a file and a rule; never to a directory,
and never to a rule an auditor would ask about.

It is also the narrowest. A lint rule reads the template, so it can see a missing `alt` and cannot see a
contrast ratio, a focus order or a live region. That is gate 3's job.

## Gate 3: axe-core against the running app

`e2e/a11y.gate.spec.ts` drives Playwright over the built app and runs axe-core in the page:

```ts
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
  .exclude('.as-split-gutter')
  .analyze();

expect(results.violations.map(v => v.id)).toEqual([]);
```

Run it against the **built** app, not the dev server. `playwright.config.ts` switches its `webServer`
command when `COMPLIANCE_GATE` is set, serving `dist/optimize-angular/browser` statically instead of
starting `ng serve`.

The one `exclude()` is the only concession in the gate, and it is deliberate. `angular-split` renders its
drag handle as `role="separator"` without the `aria-valuenow` that role requires, and that markup cannot
be reached from application code. Scoping a single named selector out leaves every other node under the
same threshold. Lowering the threshold, or dropping a WCAG tag, would have hidden the same violation plus
every future one. When a third-party component fails a rule you cannot fix, exclude the node and write
down why; never soften the rule.

axe-core finds roughly a third of WCAG failures automatically. It is a floor, not a certificate: keyboard
traps, focus order and meaningful alternative text still need a person.

## Gate 4: Lighthouse CI against dist/

`lighthouserc.json` collects from the built directory and asserts:

```json
"assertions": {
  "categories:accessibility": ["error", { "minScore": 0.95 }],
  "categories:best-practices": ["error", { "minScore": 0.9 }],
  "categories:seo": ["error", { "minScore": 0.9 }],
  "categories:performance": ["warn", { "minScore": 0.7 }],
  "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
}
```

```bash
npx --yes @lhci/cli@0.15.x autorun
```

`autorun` collects, asserts and exits 1 on a failed assertion.

Two rules about the numbers. Assert on a **floor**, never on a delta against the previous run: a
ratcheting comparison lets a branch get slower one acceptable step at a time. And put anything noisy at
`warn` rather than `error`. Performance scores from a shared runner move by ten points for reasons that
have nothing to do with your diff, which is why performance is a warning here and accessibility is not.

## The workflow

`.github/workflows/compliance-gate.yml` in the module folder runs all four on every pull request that
touches the module, and uploads the Playwright report and the Lighthouse reports as artifacts.

GitHub only executes workflows found at the **repository root** `.github/workflows/`. The file ships in
the module folder so it can be read and reviewed as course material; copy it to the repository root to
activate it.

```yaml
- run: npm ci
- run: npm run lint                          # gate 2
- run: npm run build                         # gate 1
- run: npx playwright install --with-deps chromium
- run: npx playwright test e2e/a11y.gate.spec.ts --project=chromium   # gate 3
  env:
    COMPLIANCE_GATE: '1'
- run: npx --yes @lhci/cli@0.15.x autorun    # gate 4
```

Order matters: lint first because it is the fastest, build next because gates 3 and 4 both need `dist/`.

## Making the gate survive contact with a team

- **Upload the evidence.** A failing check with no report gets disabled within a month.
- **Fail loudly, once.** Do not let a gate print a warning and pass; either it blocks or it should not exist.
- **Own the thresholds in review.** Raising a budget is a decision, so it belongs in a diff with a reason,
  not in a hotfix.
- **Keep the gate deterministic.** Nothing here touches a network it does not control.

## Where this sits in the module

This is the last demo for a reason: it is where the other fourteen become enforceable. Bundle budgets
come from the Rolldown demo, the accessibility rules from the a11y demo, the layout-shift assertion from
the Core Web Vitals demo.
