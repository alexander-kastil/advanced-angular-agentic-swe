import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';

export const demoRoutes: Routes = [
  {
    path: '',
    component: DemoContainerComponent,
    children: [
      {
        path: 'deploy-with-devops-agent',
        loadComponent: () =>
          import('./samples/deploy-with-devops-agent/deploy-with-devops-agent.component').then(
            (m) => m.DeployWithDevopsAgentComponent
          )
      },
      {
        path: 'bootstrap-and-harden',
        loadComponent: () =>
          import('./samples/bootstrap-and-harden/bootstrap-and-harden.component').then(
            (m) => m.BootstrapAndHardenComponent
          )
      },
      {
        path: 'compose-caddy-tls',
        loadComponent: () =>
          import('./samples/compose-caddy-tls/compose-caddy-tls.component').then(
            (m) => m.ComposeCaddyTlsComponent
          )
      },
      {
        path: 'agentic-seo-optimization',
        loadComponent: () =>
          import('./samples/agentic-seo-optimization/agentic-seo-optimization.component').then(
            (m) => m.AgenticSeoOptimizationComponent
          )
      }
    ]
  }
];
