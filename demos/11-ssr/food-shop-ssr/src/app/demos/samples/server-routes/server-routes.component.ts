import { Component, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { CodePanelComponent } from '../../../shared/code-panel/code-panel.component';
import { FoodItem } from '../../../food/food.model';
import { environment } from '../../../../environments/environment';

interface ServerRouteRow {
  path: string;
  renderMode: string;
  fallback: string;
  params: string;
  when: string;
}

@Component({
  selector: 'app-server-routes',
  imports: [CodePanelComponent],
  templateUrl: './server-routes.component.html',
  styleUrl: './server-routes.component.scss',
})
export class ServerRoutesComponent {
  private readonly catalog = httpResource<FoodItem[]>(() => `${environment.api}food`);

  readonly rows: ServerRouteRow[] = [
    {
      path: "''",
      renderMode: 'Prerender',
      fallback: '-',
      params: '-',
      when: 'build time, written to browser/index.html',
    },
    {
      path: "'food/:id'",
      renderMode: 'Prerender',
      fallback: 'PrerenderFallback.Server',
      params: 'getPrerenderParams()',
      when: 'build time, one file per returned id',
    },
    {
      path: "'**'",
      renderMode: 'Server',
      fallback: '-',
      params: '-',
      when: 'per request, inside the Node process',
    },
  ];

  readonly prerenderedIds = computed(() =>
    (this.catalog.value() ?? []).map((item) => ({ id: String(item.id), name: item.name }))
  );

  readonly routeFile = `import { inject } from '@angular/core';
import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { FoodService } from './food/food.service';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  {
    path: 'food/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    async getPrerenderParams() {
      const catalog = await inject(FoodService).getCatalog();
      return catalog.map((item) => ({ id: String(item.id) }));
    },
  },
  { path: '**', renderMode: RenderMode.Server },
];`;

  readonly registration = `const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes))],
};`;

  readonly builderConfig = `"build": {
  "options": {
    "server": "src/main.server.ts",
    "ssr": { "entry": "server.ts" },
    "outputMode": "server",
    "security": { "allowedHosts": ["localhost"] }
  }
}`;
}
