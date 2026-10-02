# Reading Route and Query Parameters

## Route Parameters

### With Signal Inputs (Recommended)

```typescript
// Route config
{ path: 'users/:id', component: UserDetail }

// Component - use input() for route params
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  template: `
    <h1>User {{ id() }}</h1>
  `,
})
export class UserDetail {
  // Route param as signal input
  id = input.required<string>();
  
  // Computed based on route param
  userId = computed(() => parseInt(this.id(), 10));
}
```

Enable with `withComponentInputBinding()`:

```typescript
// app.config.ts
import { provideRouter, withComponentInputBinding } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
  ],
};
```

### Query Parameters

```typescript
// Route: /search?q=angular&page=1

@Component({...})
export class Search {
  // Query params as inputs
  q = input<string>('');
  page = input<string>('1');
  
  currentPage = computed(() => parseInt(this.page(), 10));
}
```

### With ActivatedRoute (Alternative)

```typescript
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({...})
export class UserDetail {
  private route = inject(ActivatedRoute);
  
  // Convert route params to signal
  id = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id'))),
    { initialValue: null }
  );
  
  // Query params
  query = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('q'))),
    { initialValue: '' }
  );
}
```

## A route parameter is an id, never a name

A path segment carries a GUID or a number: `ai/providers/:providerId`, `ai/models/:modelId`. Never
a provider string, a model name, a slug, or a readable key the database happens to use as its
primary key. All three were tried on one page and rejected: `/ai/providers/azure-foundry`, then a
slug map to `microsoft-foundry`, then a renamed string "id". The owner's rule: "id is always a
number or guid".

- The list links with `[routerLink]="[row.modelId]"`; the detail component takes `modelId` as its
  input and looks the entity up in the store by id, then calls the API with whatever key the API
  needs.
- An entity with no GUID or numeric id gets one (schema delta, entity field, DTO field) before it
  gets a route. Mapping a slug to a key is the same defect wearing a lookup table.
- Names with `/` in them (`Bria/Bria-3.2-vector`) are the first thing a name-keyed route breaks on.

Verify: every `path: ':…'` in the route config ends in `Id`, and each `routerLink` binds an `…Id`
field: `grep -n "path: '[^']*:" src/app/app.routes.ts`.

Back to the index: [angular-routing](angular-routing.md)
