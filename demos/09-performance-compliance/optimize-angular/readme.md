# Performance and Compliance Demos

Performance measurement and optimization for Angular 22, plus the accessibility, security, privacy and
supply-chain compliance surfaces an EU-facing app has to clear.

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
