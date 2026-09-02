import { computed } from '@angular/core';
import { patchState, signalMethod, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface CatalogItem {
  id: number;
  name: string;
  category: string;
}

export interface CatalogFilter {
  category: string;
  q: string;
}

const catalog: CatalogItem[] = [
  { id: 1, name: 'Route Resolver', category: 'routing' },
  { id: 2, name: 'CanMatch Guard', category: 'routing' },
  { id: 3, name: 'Selective Preloading', category: 'routing' },
  { id: 4, name: 'Auth Interceptor', category: 'http' },
  { id: 5, name: 'Retry Interceptor', category: 'http' },
  { id: 6, name: 'Http Error Mapping', category: 'http' },
  { id: 7, name: 'App Initializer', category: 'startup' },
  { id: 8, name: 'Runtime Config', category: 'startup' },
];

export const CatalogStore = signalStore(
  withState({ items: catalog, category: 'all', q: '', applied: 0 }),
  withComputed((store) => ({
    categories: computed(() => ['all', ...new Set(store.items().map((item) => item.category))]),
    visible: computed(() => {
      const category = store.category();
      const q = store.q().toLowerCase();
      return store
        .items()
        .filter((item) => category === 'all' || item.category === category)
        .filter((item) => q === '' || item.name.toLowerCase().includes(q));
    }),
  })),
  withMethods((store) => ({
    applyRouteFilter: signalMethod<CatalogFilter>(({ category, q }) => {
      patchState(store, { category, q, applied: store.applied() + 1 });
    }),
  }))
);
