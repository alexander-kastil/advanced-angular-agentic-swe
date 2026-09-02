import { Routes } from '@angular/router';
import { provideExperimentalWebMcpForms } from '@angular/forms/signals';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { webMcpSignalProviders } from './samples/webmcp-signal/webmcp-signal.component';

export const demoRoutes: Routes = [
    {
        path: '',
        component: DemoContainerComponent,
        title: 'Demos Home',
        children: [
            {
                path: 'webmcp-counterpart',
                title: 'Demos - WebMCP Counterpart',
                loadComponent: () => import('./samples/webmcp-counterpart/webmcp-counterpart.component').then(m => m.WebmcpCounterpartComponent),
            },
            {
                path: 'webmcp-signal',
                title: 'Demos - Signals as WebMCP Tools',
                providers: webMcpSignalProviders,
                loadComponent: () => import('./samples/webmcp-signal/webmcp-signal.component').then(m => m.WebmcpSignalComponent),
            },
            {
                path: 'webmcp-in-components',
                title: 'Demos - WebMCP in Components',
                loadComponent: () => import('./samples/webmcp-in-components/webmcp-in-components.component').then(m => m.WebmcpInComponentsComponent),
            },
            {
                path: 'webmcp-form-tool',
                title: 'Demos - Form as an Agent Tool',
                providers: [provideExperimentalWebMcpForms()],
                loadComponent: () => import('./samples/webmcp-form-tool/webmcp-form-tool.component').then(m => m.WebMcpFormToolComponent),
            },
            {
                path: 'webmcp-store',
                title: 'Demos - WebMCP Store Tools',
                loadComponent: () => import('./samples/webmcp-store/webmcp-store.component').then(m => m.WebmcpStoreComponent),
            },
            {
                path: 'webmcp-navigation',
                title: 'Demos - WebMCP Navigation Tools',
                loadComponent: () => import('./samples/webmcp-navigation/webmcp-navigation.component').then(m => m.WebmcpNavigationComponent),
            },
            {
                path: 'webmcp-e2e',
                title: 'Demos - WebMCP End to End',
                loadComponent: () => import('./samples/webmcp-e2e/webmcp-e2e.component').then(m => m.WebmcpE2eComponent),
            },
        ],
    },
];
