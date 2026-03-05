# HTTP Resource Route Resolvers

## Overview

Demonstrate using **ResolveFn with HTTP requests** to preload route data before component initialization.
This pattern ensures components receive fully resolved data via signal-based inputs without needing async handling.

## Key Concepts

### Problem
- Components need data before rendering
- Observable patterns require async pipes or manual subscription handling
- Type safety is challenging with resolver data

### Solution
- Use **ResolveFn** with HTTP to preload data
- Router waits for data, then injects it via **input.required()**
- Component receives type-safe, fully resolved data

## Implementation

### 1. Create the Resolver Function

```typescript
import { ResolveFn } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export interface Album {
  userId: number;
  id: number;
  title: string;
}

export const httpResourceAlbumResolver: ResolveFn<Album> = (route) => {
  const http = inject(HttpClient);
  const id = route.paramMap.get('id') || '1';

  // Return observable directly - Angular handles subscription
  return http.get<Album>(`https://jsonplaceholder.typicode.com/albums/${id}`);
};
```

### 2. Define the Route

```typescript
import { httpResourceAlbumResolver } from './samples/httpresource-route-resolver/httpresource-route-resolver.resolver';
import { HttpresourceRouteResolverComponent } from './samples/httpresource-route-resolver/httpresource-route-resolver.component';

export const demoRoutes: Routes = [
  {
    path: 'httpresource-resolver/:id',
    component: HttpresourceRouteResolverComponent,
    resolve: {
      album: httpResourceAlbumResolver
    }
  }
];
```

### 3. Receive Resolved Data in Component

```typescript
import { Component, input } from '@angular/core';
import { Album } from './httpresource-route-resolver.component';

@Component({
  selector: 'app-httpresource-resolver',
  standalone: true,
  template: `
    @if (album(); as data) {
      <h2>{{ data.title }}</h2>
      <p>User: {{ data.userId }}</p>
    }
  `
})
export class HttpresourceRouteResolverComponent {
  // Data is injected by router as a resolved value
  readonly album = input.required<Album>();
}
```

## Benefits

✅ **Type-Safe** - Full TypeScript types for resolved data  
✅ **No Async Pipe** - Data ready when component initializes  
✅ **Automatic Binding** - Router injects resolved data as input  
✅ **Declarative** - Route configuration defines data dependencies  
✅ **Clean Component** - No subscription management needed

## Comparison: Resolver vs Resource

| Aspect | ResolveFn | resource() |
|--------|-----------|-----------|
| **When** | Pre-route loading | In-component loading |
| **Pattern** | Functional resolver | Signal-based resource |
| **Data Flow** | Route → Component | Component → Signal |
| **Use Case** | Route guards, prereq data | On-demand loading, polling |
| **Error Handling** | Router guards | Component state |

**Use ResolveFn when:**
- Data is required before component activation
- Want to prevent navigation until data loads
- Implementing breadcrumb/title data dependencies

**Use resource() when:**
- Component handles its own data loading
- Need fine-grained control over loading states
- Supporting user interactions that fetch more data

## Advanced Pattern: linkedSignal with Route Params

For more dynamic patterns, combine resolvers with **linkedSignal** to keep component state in sync:

```typescript
import { linkedSignal, signal } from '@angular/core';

export class AdvancedComponent {
  readonly albumId = input.required<number>();
  
  // Synced signal that reacts to route param changes
  readonly syncedId = linkedSignal(() => this.albumId());
  
  loadOtherAlbum(newId: number) {
    // Component can update independently
    this.syncedId.set(newId);
  }
}
```

## Router Guard Integration

Use resolvers safely with canActivate guards:

```typescript
const route = {
  path: 'album/:id',
  component: AlbumComponent,
  canActivate: [authGuard], // Runs first
  resolve: {
    album: albumResolver    // Runs after guard passes
  }
};
```

## Error Handling

Handle resolver errors with a resolver guard:

```typescript
export const safeAlbumResolver: ResolveFn<Album | null> = (route) => {
  const http = inject(HttpClient);
  const id = route.paramMap.get('id') || '1';

  return http.get<Album>(`https://jsonplaceholder.typicode.com/albums/${id}`)
    .pipe(
      catchError((error) => {
        console.error('Album load failed:', error);
        return of(null); // Return null on error
      })
    );
};
```

## See Also

- [Route Resolvers with Signals](./route-resolvers-signals.md) - Basic resolver pattern
- [Query Parameters with Signals](./query-params-signals.md) - Reactive route parameters
- [App Initialization](./app-init.md) - Early app startup logic
