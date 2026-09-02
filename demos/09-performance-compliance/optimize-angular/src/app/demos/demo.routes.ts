import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';

export const demoRoutes: Routes = [
    {
        path: '',
        component: DemoContainerComponent,
        title: 'Demos Home',
        children: [
            {
                path: 'lighthouse',
                title: 'Demos - Audit Core Web Vitals',
                loadComponent: () => import('./samples/lighthouse/lighthouse.component').then(m => m.LighthouseComponent),
            },
            {
                path: 'devtools-profiling',
                title: 'Demos - Profile with Angular DevTools',
                loadComponent: () => import('./samples/devtools-profiling/devtools-profiling.component').then(m => m.DevtoolsProfilingComponent),
            },
            {
                path: 'optimize-bundles',
                title: 'Demos - Optimize Bundles with Rolldown',
                loadComponent: () => import('./samples/optimize-bundles/optimize-bundles.component').then(m => m.OptimizeBundlesComponent),
            },
            {
                path: 'defer-views',
                title: 'Demos - Defer Non-Critical Views',
                loadComponent: () => import('./samples/defer-views/defer-views.component').then(m => m.DeferViewsComponent),
            },
            {
                path: 'defer-by-trigger',
                title: 'Demos - Compare Defer Triggers',
                loadComponent: () => import('./samples/defer-by-trigger/defer-by-trigger.component').then(m => m.DeferByTriggerComponent),
            },
            {
                path: 'zoneless',
                title: 'Demos - Zoneless Change Detection',
                loadComponent: () => import('./samples/zoneless/zoneless.component').then(m => m.ZonelessComponent),
            },
            {
                path: 'configure-zoneless',
                title: 'Demos - Configure Zoneless',
                loadComponent: () => import('./samples/configure-zoneless/configure-zoneless.component').then(m => m.ConfigureZonelessComponent),
            },
            {
                path: 'virtual-scroll',
                title: 'Demos - Virtual Scroll Large Lists',
                loadComponent: () => import('./samples/virtual-scroll/virtual-scroll.component').then(m => m.VirtualScrollComponent),
            },
            {
                path: 'ng-optimized-img',
                title: 'Demos - Optimize Images',
                loadComponent: () => import('./samples/ng-optimized-img/ng-optimized-img.component').then(m => m.NgOptimizedImgComponent),
            },
            {
                path: 'a11y',
                title: 'Demos - Build Accessible UI',
                loadComponent: () => import('./samples/a11y/a11y.component').then(m => m.A11yComponent),
            },
            {
                path: 'auto-csp',
                title: 'Demos - Harden with Strict CSP',
                loadComponent: () => import('./samples/auto-csp/auto-csp.component').then(m => m.AutoCspComponent),
            },
            {
                path: 'consent-privacy',
                title: 'Demos - Gate Third-Party Content',
                loadComponent: () => import('./samples/consent-privacy/consent-privacy.component').then(m => m.ConsentPrivacyComponent),
            },
            {
                path: 'consent-gated-scripts',
                title: 'Demos - Load Scripts After Consent',
                loadComponent: () => import('./samples/consent-gated-scripts/consent-gated-scripts.component').then(m => m.ConsentGatedScriptsComponent),
            },
            {
                path: 'license-audit',
                title: 'Demos - Audit Dependencies and Licenses',
                loadComponent: () => import('./samples/license-audit/license-audit.component').then(m => m.LicenseAuditComponent),
            },
            {
                path: 'compliance-gates',
                title: 'Demos - Gate the Pull Request',
                loadComponent: () => import('./samples/compliance-gates/compliance-gates.component').then(m => m.ComplianceGatesComponent),
            },
        ],
    },
];
