# Performance and Compliance

A fast application and a lawful application are built the same way: by measuring what is actually
shipped and by making the constraint fail the build rather than the audit. This module covers the
performance half (Core Web Vitals, the Rolldown build pipeline and budgets, deferred views, zoneless
change detection, virtual scrolling and image optimization) and the compliance half that Angular 22 apps
now have to clear in the EU: WCAG 2.2 AA under the European Accessibility Act, a strict Content Security
Policy, consent before third-party content, and a dependency inventory you can defend.

## Demos

| #   | Route            | Title                             | Teaches                                                                                                                          | Topic                     |
| --- | ---------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| 1   | lighthouse       | Audit Core Web Vitals             | Measure LCP, INP, CLS, FCP and TTFB live with PerformanceObserver and reproduce them in a Lighthouse lab run.                     | Performance Measurement   |
| 2   | optimize-bundles | Optimize Bundles with Rolldown    | Read the Rolldown build pipeline of @angular/build, enforce size budgets, and keep heavy libraries out of the initial chunk.      | Bundle Optimization       |
| 3   | defer-views      | Defer Non-Critical Views          | Split a template with @defer blocks, drive them with interaction, viewport and when triggers, and prefetch on idle.               | Loading Performance       |
| 4   | configure-zoneless | Configure Zoneless              | Run without zone.js using provideZonelessChangeDetection() so change detection is scheduled by signals and events.                | Runtime Performance       |
| 5   | virtual-scroll   | Virtual Scroll Large Lists        | Render 100000 rows with the CDK virtual scroll viewport and watch the rendered range instead of the whole list.                   | Runtime Performance       |
| 6   | ng-optimized-img | Optimize Images                   | Use NgOptimizedImage for srcset generation, reserved layout space, lazy loading and a single prioritized LCP image.               | Asset Optimization        |
| 7   | a11y             | Build Accessible UI               | Meet WCAG 2.2 AA for the European Accessibility Act with @angular/aria widgets, template lint rules and an axe scan.              | Accessibility Compliance  |
| 8   | auto-csp         | Harden with Strict CSP            | Generate a hash-based strict Content Security Policy with the security.autoCsp build option and watch violations.                 | Security Compliance       |
| 9   | consent-privacy  | Gate Third-Party Content          | Block analytics and external media until consent is granted, and make withdrawal as easy as granting.                             | Privacy Compliance        |
| 10  | license-audit    | Audit Dependencies and Licenses   | Inventory runtime dependencies, their licences and their obligations, and fail CI on new advisories.                              | Supply Chain Compliance   |

## Run the app

```bash
cd optimize-angular
npm install
npx json-server db.json --port 3000
npm start
```

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
