# Route Resolvers with Signals

## Overview

`ResolveFn` with signals provides a modern way to preload route data before component initialization. Data flows directly to component signal inputs, eliminating manual subscription management.

## Basic Usage

```typescript
import { ResolveFn } from "@angular/router";
import { inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

export interface User {
  id: number;
  name: string;
  email: string;
}

export const userResolver: ResolveFn<User> = async (route) => {
  const http = inject(HttpClient);
  const id = route.paramMap.get("id");

  return await firstValueFrom(http.get<User>(`/api/users/${id}`));
};
```

## Route Configuration

```typescript
export const routes: Routes = [
  {
    path: "users/:id",
    component: UserDetailComponent,
    resolve: {
      user: userResolver,
    },
  },
];
```

## Component with Signal Inputs

```typescript
@Component({
  selector: "app-user-detail",
  template: `
    @if (user(); as userData) {
      <h1>{{ userData.name }}</h1>
      <p>{{ userData.email }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UserDetailComponent {
  readonly user = input<User>();
}
```

## Key Benefits

- **No manual subscriptions** — Resolver delivers data via signal input
- **Type-safe** — Full TypeScript support for resolved data
- **Automatic unwrapping** — Access resolved data without `async` pipe or `| json`
- **Change detection friendly** — OnPush works seamlessly
- **Error handling** — Resolver can catch and transform errors before component sees them

## Error Handling in Resolver

```typescript
export const userResolver: ResolveFn<User | null> = async (route) => {
  const http = inject(HttpClient);
  const id = route.paramMap.get("id");

  try {
    return await firstValueFrom(http.get<User>(`/api/users/${id}`));
  } catch (error) {
    console.error("Failed to load user:", error);
    return null; // Handle gracefully
  }
};
```

## When to Use

✅ **Use ResolveFn when:**

- Data MUST be available before route activation
- You want to prevent navigation to incomplete states
- Data is needed by multiple child routes
- You need centralized error handling for route data

❌ **Use httpResource() instead when:**

- Component can render while loading
- You need real-time data updates
- Loading state UI is important (spinners, skeletons)
