# Resource API - Reactive Data Loading

## Overview

The `resource()` API is Angular's modern, signal-based approach to HTTP data fetching. It replaces manual `Observable` + `.subscribe()` patterns with declarative, reactive data loading that automatically manages loading states, errors, and value changes.

## Basic Usage

Create a resource with a loader function:

```typescript
import { Component, inject, resource } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

interface Pet {
  id: number;
  name: string;
  breed: string;
}

@Component({
  selector: "app-pet-detail",
  template: `
    @if (petResource.isLoading()) {
      <p>Loading...</p>
    }
    @if (petResource.error(); as error) {
      <p>Error: {{ error }}</p>
    }
    @if (petResource.value(); as pet) {
      <p>{{ pet.name }}</p>
    }
  `,
})
export class PetDetailComponent {
  private http = inject(HttpClient);

  protected petResource = resource({
    loader: async () => {
      return await firstValueFrom(this.http.get<Pet>("/api/pets/1"));
    },
  });
}
```

## Reactive Requests

Use the `request()` function to make resources automatically refetch when signals change:

```typescript
export class PetDetailComponent {
  private http = inject(HttpClient);
  protected petId = signal(1);

  protected petResource = resource({
    request: () => ({ id: this.petId() }),
    loader: async ({ request }) => {
      return await firstValueFrom(this.http.get<Pet>(`/api/pets/${request.id}`));
    },
  });

  protected loadNext() {
    this.petId.update((id) => id + 1); // Automatically refetches!
  }
}
```

## Resource State

Access the built-in loading state, errors, and values:

```typescript
const myResource = resource({ ... });

// Reactive signals
myResource.value()      // Signal<Data | undefined>
myResource.isLoading()  // Signal<boolean>
myResource.error()      // Signal<Error | undefined>
myResource.status()     // Signal<'loading' | 'success' | 'error'>

// Manual control
myResource.reload()     // Trigger refetch manually
```

## Template Usage

Use with `@if`, `@for`, and modern control flow:

```html
@if (myResource.isLoading()) {
<app-spinner />
} @if (myResource.error(); as error) {
<div class="error">{{ error }}</div>
} @if (myResource.value(); as data) { @for (item of data; track item.id) {
<app-item [item]="item" />
} }
```

## Advantages over Manual Subscription Pattern

| Feature                      | resource()                            | .subscribe()             |
| ---------------------------- | ------------------------------------- | ------------------------ |
| **Automatic loading state**  | ✅ Built-in                           | ❌ Manual signals        |
| **Automatic error handling** | ✅ Built-in                           | ❌ Manual error logic    |
| **Reactive updates**         | ✅ Automatic refetch on signal change | ❌ Must manually trigger |
| **Memory leaks**             | ✅ No                                 | ❌ Must unsubscribe      |
| **Lines of code**            | ✅ ~5 lines                           | ❌ ~20+ lines            |
| **Test complexity**          | ✅ Simple                             | ❌ Complex mocking       |

## Common Patterns

### Conditional Requests

Skip loading when conditions aren't met:

```typescript
protected id = signal<number | undefined>(undefined);

protected data = resource({
  request: () => {
    const currentId = this.id();
    return currentId ? { id: currentId } : undefined;
  },
  loader: async ({ request }) => {
    if (!request) return undefined;
    return await firstValueFrom(this.http.get(`/api/items/${request.id}`));
  }
});
```

### Manual Reload

Trigger refetch manually:

```typescript
protected handleRefresh() {
  this.myResource.reload();
}
```

### Transform Data

Apply transformations in the loader:

```typescript
protected items = resource({
  loader: async () => {
    const data = await firstValueFrom(this.http.get<Pet[]>('/api/pets'));
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }
});
```

## Key Differences from Observables

- **resource()**: Synchronous, signal-based, managed lifecycle
- **Observable**: Asynchronous, RxJS-based, manual subscription management

## Further Reading

- [Angular Resource Documentation](https://angular.dev/guide/signals/resource)
- [HTTP Client Guide](https://angular.dev/guide/http)
