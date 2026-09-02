import { Component, declareExperimentalWebMcpTool, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DemoService } from '../../demo-container/demo.service';

@Component({
  selector: 'app-webmcp-navigation',
  templateUrl: './webmcp-navigation.component.html',
  styleUrls: ['./webmcp-navigation.component.scss'],
})
export class WebmcpNavigationComponent {
  private router = inject(Router);
  private demoService = inject(DemoService);

  readonly demos = this.demoService.demos;
  readonly targets = ['route-titles', 'route-inputs', 'view-transitions', 'multi-guard'];
  readonly calls = signal<string[]>([]);
  readonly agentPresent = signal(this.detectAgent());

  constructor() {
    declareExperimentalWebMcpTool({
      name: 'list_demos',
      description: 'List every demo of this Angular routing module with its route segment.',
      inputSchema: { type: 'object', properties: {} },
      execute: () => {
        this.record('list_demos');
        return JSON.stringify(
          this.demos().map(({ url, title, topic }) => ({ url, title, topic }))
        );
      },
    });

    declareExperimentalWebMcpTool({
      name: 'navigate_to_demo',
      description:
        'Navigate the application to one demo. Pass the route segment returned by list_demos.',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Route segment of the demo, for example route-titles' },
        },
        required: ['url'],
      },
      execute: async ({ url }) => {
        this.record(`navigate_to_demo(${url})`);
        const ok = await this.router.navigate(['/demos', url]);
        return ok ? `Navigated to /demos/${url}` : `Navigation to /demos/${url} was rejected`;
      },
    });

    declareExperimentalWebMcpTool({
      name: 'current_route',
      description: 'Report the URL the application is currently showing.',
      inputSchema: { type: 'object', properties: {} },
      execute: () => {
        this.record('current_route');
        return this.router.url;
      },
    });
  }

  simulateAgentCall(url: string) {
    this.record(`navigate_to_demo(${url})`);
    this.router.navigate(['/demos', url]);
  }

  private record(call: string) {
    this.calls.update((calls) => [`${new Date().toLocaleTimeString()} ${call}`, ...calls]);
  }

  private detectAgent() {
    const context =
      (globalThis.document as unknown as { modelContext?: unknown }).modelContext ??
      (globalThis.navigator as unknown as { modelContext?: unknown }).modelContext;
    return context != null;
  }
}
