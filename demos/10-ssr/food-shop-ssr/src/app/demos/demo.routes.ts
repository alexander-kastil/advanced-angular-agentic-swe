import { Routes } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { CsrVsSsrDeltaComponent } from './samples/csr-vs-ssr-delta/csr-vs-ssr-delta.component';
import { IncrementalHydrationComponent } from './samples/incremental-hydration/incremental-hydration.component';
import { KarmaToVitestComponent } from './samples/karma-to-vitest/karma-to-vitest.component';
import { NodeAppEngineComponent } from './samples/node-app-engine/node-app-engine.component';
import { DishParamsComponent } from './samples/route-params-signals/dish-params/dish-params.component';
import { RouteParamsSignalsComponent } from './samples/route-params-signals/route-params-signals.component';
import { ServerRoutesComponent } from './samples/server-routes/server-routes.component';
import { TransferCacheComponent } from './samples/transfer-cache/transfer-cache.component';

export const demoRoutes: Routes = [
  {
    path: '',
    component: DemoContainerComponent,
    providers: [provideMarkdown()],
    children: [
      { path: 'server-routes', component: ServerRoutesComponent },
      { path: 'node-app-engine', component: NodeAppEngineComponent },
      { path: 'incremental-hydration', component: IncrementalHydrationComponent },
      { path: 'transfer-cache', component: TransferCacheComponent },
      {
        path: 'route-params-signals',
        component: RouteParamsSignalsComponent,
        children: [{ path: ':id', component: DishParamsComponent }],
      },
      { path: 'csr-vs-ssr-delta', component: CsrVsSsrDeltaComponent },
      { path: 'karma-to-vitest', component: KarmaToVitestComponent },
    ],
  },
];
