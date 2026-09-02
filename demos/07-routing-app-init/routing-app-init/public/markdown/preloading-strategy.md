# Preloading Strategy

## Overview

Preloading strategies control when and how lazy-loaded modules are downloaded in the background.

## Built-in Strategies

### NoPreloading (Default)
```typescript
provideRouter(routes) // No preloading
```

### PreloadAllModules
```typescript
import { PreloadAllModules } from '@angular/router';

provideRouter(
  routes,
  withPreloading(PreloadAllModules)
)
```

## Custom Preloading Strategy

Create selective preloading based on route data:

```typescript
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preloadedModules: string[] = [];

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data?.['preload']) {
      this.preloadedModules.push(route.path || '');
      console.log('Preloading:', route.path);
      return load();
    }
    return of(null);
  }
}
```

### Configure Strategy

```typescript
// app.config.ts
import { SelectivePreloadingStrategy } from './preloading-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(SelectivePreloadingStrategy)
    )
  ]
};
```

### Mark Routes for Preloading

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    data: { preload: true }, // Will be preloaded
    loadChildren: () => import('./dashboard/routes')
  },
  {
    path: 'admin',
    // No preload flag - won't be preloaded
    loadChildren: () => import('./admin/routes')
  }
];
```

## Network-Aware Preloading

Preload only on fast connections:

```typescript
preload(route: Route, load: () => Observable<any>): Observable<any> {
  if (route.data?.['preload']) {
    const conn = (navigator as any).connection;
    if (conn && conn.effectiveType === '4g') {
      return load();
    }
  }
  return of(null);
}
```

## Best Practices

- Use `PreloadAllModules` for small apps
- Use custom strategy for large apps with many lazy routes
- Consider network conditions
- Monitor preloaded modules in dev tools
- Preload high-probability routes (e.g., authenticated areas after login)

## In this demo

The strategy is registered on the router and keeps the preloaded paths in a signal:

```typescript
provideRouter(
  appRoutes,
  withComponentInputBinding(),
  withViewTransitions(),
  withPreloading(SelectivePreloadingStrategy)
),
```

```typescript
@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  readonly preloadedRoutes = signal<string[]>([]);

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (!route.data?.['preload']) {
      return of(null);
    }

    this.preloadedRoutes.update((routes) => [...routes, route.path ?? '']);
    return load();
  }
}
```

`skills` carries `data: { preload: true }` in `app.routes.ts` and `customers` does not, so `skills-routes` is fetched in the background while `customer-routes` waits for the first navigation.
