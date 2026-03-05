import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { A11yComponent } from './samples/a11y/a11y.component';
import { EsbuildComponent } from './samples/esbuild/esbuild.component';
import { EslintComponent } from './samples/eslint/eslint.component';
import { LighthouseComponent } from './samples/lighthouse/lighthouse.component';
import { NgOptimizedImageComponent } from './samples/ng-optimized-image/ng-optimized-image.component';
import { VirtualScrollComponent } from './samples/virtual-scroll/virtual-scroll.component';
import { BundlesComponent } from './samples/bundles/bundles.component';
import { ConfigureZonelessComponent } from './samples/configure-zoneless/configure-zoneless.component';

export const demoRoutes: Routes = [
    {
        path: '',
        component: DemoContainerComponent,
        title: 'Demos Home',
        children: [
            { path: 'esbuild', component: EsbuildComponent, title: 'Demos - ES Build' },
            { path: 'optimize-bundles', component: BundlesComponent, title: 'Demos - Optimize Bundles' },
            { path: 'configure-zoneless', component: ConfigureZonelessComponent, title: 'Demos - Configure Zoneless' },
            { path: 'lighthouse', component: LighthouseComponent, title: 'Demos - Lighthouse KPIs' },
            { path: 'virtual-scroll', component: VirtualScrollComponent, title: 'Demos - Virtual Scroll' },
            { path: 'a11y', component: A11yComponent, title: 'Demos - A11y' },
            { path: 'eslint', component: EslintComponent, title: 'Demos - ESLint' },
            { path: 'ng-optimized-img', component: NgOptimizedImageComponent },
        ],
    },
];