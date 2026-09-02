import { inject } from '@angular/core';
import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { FoodService } from './food/food.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'food/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    async getPrerenderParams() {
      const catalog = await inject(FoodService).getCatalog();
      return catalog.map((item) => ({ id: String(item.id) }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
