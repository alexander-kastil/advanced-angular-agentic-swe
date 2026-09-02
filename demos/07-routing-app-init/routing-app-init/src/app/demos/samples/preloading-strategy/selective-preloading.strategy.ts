import { Injectable, signal } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

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
