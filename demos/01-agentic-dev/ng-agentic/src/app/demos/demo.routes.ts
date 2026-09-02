import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';

export const demoRoutes: Routes = [
  {
    path: '',
    component: DemoContainerComponent,
    children: [
      {
        path: 'angular-mcp-server',
        loadComponent: () =>
          import('./samples/angular-mcp-server/angular-mcp-server.component').then(
            (m) => m.AngularMcpServerComponent
          )
      },
      {
        path: 'harness-files',
        loadComponent: () =>
          import('./samples/harness-files/harness-files.component').then(
            (m) => m.HarnessFilesComponent
          )
      },
      {
        path: 'agent-skills',
        loadComponent: () =>
          import('./samples/agent-skills/agent-skills.component').then(
            (m) => m.AgentSkillsComponent
          )
      },
      {
        path: 'angular-expert-agent',
        loadComponent: () =>
          import('./samples/angular-expert-agent/angular-expert-agent.component').then(
            (m) => m.AngularExpertAgentComponent
          )
      },
      {
        path: 'hooks-and-gates',
        loadComponent: () =>
          import('./samples/hooks-and-gates/hooks-and-gates.component').then(
            (m) => m.HooksAndGatesComponent
          )
      },
    ]
  }
];
