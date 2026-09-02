# Performance and Compliance Demos

Performance measurement and optimization for Angular 22, plus the accessibility, security, privacy and
supply-chain compliance surfaces an EU-facing app has to clear.

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

## Scripts

```bash
npm start          # ng serve
npm run build      # production build, exits 1 over a budget maximumError
npm run lint       # eslint 9 flat config, eslint.config.js
npm test           # vitest through @angular/build:unit-test
```

The demo list and the markdown guides are served from `db.json` (run
`npx json-server db.json --port 3000`) and from `public/markdown/`.

## Compliance gate files

| File | Gate |
| --- | --- |
| `angular.json` `budgets` | Initial bundle size, error at 2 MB |
| `eslint.config.js` | Nine `@angular-eslint/template` accessibility rules, all `error` |
| `e2e/a11y.gate.spec.ts` | axe-core over five routes, WCAG 2.2 AA tags |
| `lighthouserc.json` | Lighthouse CI assertions against `dist/optimize-angular/browser` |
| `../.github/workflows/compliance-gate.yml` | Runs all four on a pull request |
