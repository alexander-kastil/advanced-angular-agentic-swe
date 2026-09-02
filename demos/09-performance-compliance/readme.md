# Performance and Compliance

A fast application and a lawful application are built the same way: by measuring what is actually
shipped and by making the constraint fail the build rather than the audit. This module covers the
performance half (Core Web Vitals, the Rolldown build pipeline and budgets, deferred views, zoneless
change detection, virtual scrolling and image optimization) and the compliance half that Angular 22 apps
now have to clear in the EU: WCAG 2.2 AA under the European Accessibility Act, a strict Content Security
Policy, consent before third-party content, and a dependency inventory you can defend.

## Scope: this module gates the local build

**Module 09 gates the pull request against the local build.** Everything here runs on a CI runner
against the source tree and against `dist/`: size budgets, template accessibility lint, an axe scan of
the built app, and a Lighthouse CI run over the output directory. No DNS, no TLS, no deployment, no field
data. The question is whether the artifact is allowed to ship.

**Module 12 measures Core Web Vitals after deploy**, against a live origin with real users and a real
network, and closes the fix-verify loop there. Same metrics, different question, and deliberately not
duplicated here. A gate that depends on a deployed URL fails when the deploy is slow, and a flaky gate is
a disabled gate.

The EU AI Act is out of scope for this module.

## Demos

| #   | Route | Title | Teaches | Topic |
| --- | --- | --- | --- | --- |
| 1 | lighthouse | Audit Core Web Vitals | Measure LCP, INP, CLS, FCP and TTFB live with PerformanceObserver and reproduce them in a Lighthouse lab run. | Performance Measurement |
| 2 | devtools-profiling | Profile with Angular DevTools | Record a Chrome performance trace with enableProfiling(), read the Angular track, and turn a shape in the flame chart into a fix. | Performance Measurement |
| 3 | optimize-bundles | Optimize Bundles with Rolldown | Read the Rolldown build pipeline of @angular/build, enforce size budgets, and keep heavy libraries out of the initial chunk. | Bundle Optimization |
| 4 | defer-views | Defer Non-Critical Views | Split a template with @defer blocks, drive them with interaction, viewport and when triggers, and prefetch on idle. | Loading Performance |
| 5 | defer-by-trigger | Compare Defer Triggers | Run all seven @defer triggers side by side and measure the chunk each one pulls, in bytes and in milliseconds. | Loading Performance |
| 6 | zoneless | Zoneless Change Detection | See what schedules a refresh without zone.js: signal writes and template listeners do, a bare setTimeout does not. | Runtime Performance |
| 7 | configure-zoneless | Configure Zoneless | Run without zone.js using provideZonelessChangeDetection() so change detection is scheduled by signals and events. | Runtime Performance |
| 8 | virtual-scroll | Virtual Scroll Large Lists | Render 100000 rows with the CDK virtual scroll viewport and watch the rendered range instead of the whole list. | Runtime Performance |
| 9 | ng-optimized-img | Optimize Images | Use NgOptimizedImage for srcset generation, reserved layout space, lazy loading and a single prioritized LCP image. | Asset Optimization |
| 10 | a11y | Build Accessible UI | Meet WCAG 2.2 AA for the European Accessibility Act with @angular/aria widgets, template lint rules and an axe scan. | Accessibility Compliance |
| 11 | auto-csp | Harden with Strict CSP | Generate a hash-based strict Content Security Policy with the security.autoCsp build option and watch violations. | Security Compliance |
| 12 | consent-privacy | Gate Third-Party Content | Block analytics and external media until consent is granted, and make withdrawal as easy as granting. | Privacy Compliance |
| 13 | consent-gated-scripts | Load Scripts After Consent | Inject third-party tags only once consent exists, prove it from the resource timeline, and handle withdrawal honestly. | Privacy Compliance |
| 14 | license-audit | Audit Dependencies and Licenses | Inventory runtime dependencies, their licences and their obligations, and fail CI on new advisories. | Supply Chain Compliance |
| 15 | compliance-gates | Gate the Pull Request | Fail the build on budgets, template accessibility lint, an axe scan and Lighthouse CI, with a workflow that blocks the merge. | Delivery Compliance |

## Run the app

```bash
cd optimize-angular
npm install
npx json-server db.json --port 3000
npm start
```

## Run the compliance gates locally

```bash
cd optimize-angular
npm run lint                                   # template accessibility rules
npm run build                                  # size budgets
npx playwright install --with-deps chromium
COMPLIANCE_GATE=1 npx playwright test e2e/a11y.gate.spec.ts --project=chromium
npx --yes @lhci/cli@0.15.x autorun             # asserts against dist/
```

Each command exits non-zero when its gate trips. The workflow that runs all four on a pull request lives
at `.github/workflows/compliance-gate.yml` in this module folder. GitHub only executes workflows found at
the repository root, so copy it to the repository root `.github/workflows/` to activate it; it ships here
as reviewable course material.

## Performance

[Core Web Vitals](https://web.dev/explore/learn-core-web-vitals)

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)

[Angular deferrable views](https://angular.dev/guide/templates/defer)

[Angular zoneless](https://angular.dev/guide/zoneless)

[NgOptimizedImage](https://angular.dev/guide/image-optimization)

[CDK Scrolling](https://material.angular.dev/cdk/scrolling/overview)

## Compliance

[European Accessibility Act (Directive 2019/882)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882)

[EN 301 549](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/)

[WCAG 2.2](https://www.w3.org/TR/WCAG22/)

[Angular Aria](https://angular.dev/guide/aria)

[axe-core rule descriptions](https://dequeuniversity.com/rules/axe/)

[Angular security and auto CSP](https://angular.dev/best-practices/security)

[Strict CSP](https://web.dev/articles/strict-csp)

[Angular DevTools](https://angular.dev/tools/devtools)

[Profiling with the Chrome DevTools](https://angular.dev/best-practices/profiling-with-chrome-devtools)

[angular-eslint template rules](https://github.com/angular-eslint/angular-eslint/tree/main/packages/eslint-plugin-template/docs/rules)

[axe-core for Playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)

[Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

[DSGVO Art. 6 lawful basis](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679)
