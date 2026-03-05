# HTTP Resource

## Overview

`resource()` is Angular's modern signal-based API for HTTP data fetching. It replaces manual HTTP + subscribe patterns with reactive, declarative data loading.

## Basic Usage

```typescript
import { Component, signal, inject, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-users',
  template: `
    @if (users.isLoading()) {
      <p>Loading...</p>
    }
    @if (users.error(); as error) {
      <p>Error: {{ error }}</p>
    }
    @if (users.value(); as data) {
      @for (user of data; track user.id) {
        <p>{{ user.name }}</p>
      }
    }
  `
})
export class UsersComponent {
  private http = inject(HttpClient);
  
  protected users = resource({
    loader: async () => {
      return await firstValueFrom(
        this.http.get<User[]>('/api/users')
      );
    }
  });
}
```

## Reactive Requests

Automatically refetch when signals change:

```typescript
export class UserDetailComponent {
  private http = inject(HttpClient);
  protected userId = signal(1);

  protected user = resource({
    request: () => ({ id: this.userId() }),
    loader: async ({ request }) => {
      return await firstValueFrom(
        this.http.get<User>(`/api/users/${request.id}`)
      );
    }
  });

  protected loadNext() {
    this.userId.update(id => id + 1); // Auto-refetches
  }
}
```

## Resource State

Access loading state, errors, and values:

```typescript
const myResource = resource({ ... });

myResource.value()      // Signal<Data | undefined>
myResource.isLoading()  // Signal<boolean>
myResource.error()      // Signal<Error | undefined>
myResource.reload()     // Manually trigger refetch
```

## vs Observable + Subscribe

**Old Pattern (❌ Avoid):**
```typescript
export class OldComponent {
  data = signal<User[]>([]);
  loading = signal(false);

  loadData(id: number) {
    this.loading.set(true);
    this.http.get<User[]>(`/api/users/${id}`).subscribe({
      next: data => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
      }
    });
  }
}
```

**New Pattern (✅ Use):**
```typescript
export class NewComponent {
  private http = inject(HttpClient);
  protected userId = signal(1);
  
  protected users = resource({
    request: () => ({ id: this.userId() }),
    loader: async ({ request }) => {
      return await firstValueFrom(
        this.http.get<User[]>(`/api/users/${request.id}`)
      );
    }
  });
}
```

## Benefits

- **Automatic cleanup**: No manual unsubscribe
- **Loading states**: Built-in loading/error signals
- **Reactive**: Auto-refetch when request changes
- **OnPush compatible**: Works perfectly with zoneless change detection
- **Type-safe**: Full TypeScript support

## Use Cases

- Loading data on component init
- Reactive data fetching based on signals
- Paginated lists
- Search/filter results
- Detail views with route params

## Best Practices

- Always use `resource()` for data loading in components
- Avoid manual `.subscribe()` in component code
- Use signals for request parameters
- Handle loading/error states in templates
- Use `reload()` sparingly - prefer reactive requests
