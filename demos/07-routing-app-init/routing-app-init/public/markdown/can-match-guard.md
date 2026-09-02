# CanMatch Guard

## Overview

`canMatch` is a route guard that prevents lazy modules from being loaded if the guard fails. This differs from `canActivate`, which loads the module but prevents navigation.

## canMatch vs canActivate

| Guard | Module Loading | Use Case |
|-------|---------------|----------|
| `canMatch` | Prevented if guard fails | Role-based features, conditional modules |
| `canActivate` | Always loads | Authentication, permissions|

## Use Case: Role-Based Features

Prevent downloading admin module for non-admin users:

```typescript
import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  if (!auth.isAdmin()) {
    router.navigate(['/']);
    return false; // Module will NOT be downloaded
  }
  
  return true;
};

// Route configuration
export const routes: Routes = [
  {
    path: 'admin',
    canMatch: [adminGuard], // ✅ Module not loaded for non-admins
    loadChildren: () => import('./admin/routes')
  }
];
```

## The three-argument signature

`CanMatchFn` takes three arguments, not two:

```typescript
type CanMatchFn = (
  route: Route,
  segments: UrlSegment[],
  currentSnapshot: PartialMatchRouteSnapshot,
) => MaybeAsync<GuardResult>;
```

`route` is the `Route` config object being tested and `segments` are the URL segments still unmatched. Neither tells you anything about the route's own parameters, because at `canMatch` time the route has not been activated and no `ActivatedRouteSnapshot` exists yet.

The third argument fills that gap. `PartialMatchRouteSnapshot` is the part of an `ActivatedRouteSnapshot` that is already known while matching:

```typescript
type PartialMatchRouteSnapshot = Pick<
  ActivatedRouteSnapshot,
  'routeConfig' | 'url' | 'params' | 'queryParams' | 'fragment' | 'data' | 'outlet' | 'title' | 'paramMap' | 'queryParamMap'
>;
```

So a `canMatch` guard can read query parameters, the fragment, the parent's `params` and the route `data` without reconstructing them from `segments`:

```typescript
export const featureFlagGuard: CanMatchFn = (route, segments, snapshot) => {
  const flags = inject(FeatureFlagService);
  const preview = snapshot.queryParamMap.get('preview') === 'true';

  return preview || flags.isEnabled(snapshot.data['feature']);
};
```

What is deliberately absent from the type is `component`, `resolve` data and `children`: none of those are resolved before the route matches. `RedirectFunction` receives the same `PartialMatchRouteSnapshot` for the same reason.

## Multiple canMatch Guards

Guards execute in order. First failure aborts:

```typescript
export const routes: Routes = [
  {
    path: 'premium',
    canMatch: [
      isAuthenticatedGuard,  // Check first
      isPremiumUserGuard     // Only runs if first passes
    ],
    loadChildren: () => import('./premium/routes')
  }
];
```

## Benefits

- **Reduced bundle size**: Don't download code users can't access
- **Performance**: Faster initial load
- **Security**: Additional layer preventing module enumeration
- **Network efficiency**: Save bandwidth for users

## canActivate Example (Loads Module)

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard], // ❌ Module downloads even if not authenticated
    loadChildren: () => import('./dashboard/routes')
  }
];
```

## When to Use canMatch

- Role-based features (admin, premium, etc.)
- Platform-specific modules (mobile vs desktop)
- Feature flags
- A/B testing variants
- Any scenario where users shouldn't download unused code

## When to Use canActivate

- Authentication checks after module is useful for multiple users
- Data validation before activation
- Confirmation dialogs
- Dynamic access that changes frequently

## Implementation Pattern

```typescript
import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';

export const featureGuard: CanMatchFn = (route, segments) => {
  const featureService = inject(FeatureService);
  
  // Sync check
  if (!featureService.hasAccess(route.data?.['feature'])) {
    return false;
  }
  
  // Async check with Observable
  return featureService.checkAccess().pipe(
    map(hasAccess => hasAccess || inject(Router).createUrlTree(['/']))
  );
};
```

## Best Practices

- Use `canMatch` for role/feature-based lazy modules
- Use `canActivate` for authentication checks
- Combine both when needed
- Return `UrlTree` for redirects
- Keep guard logic simple and fast
- Log guard failures for debugging

## In this demo

`featureAccessGuard` guards a child route that is loaded with `loadComponent`. It passes only for a prime member:

```typescript
{
  path: 'can-match-guard',
  component: CanMatchGuardComponent,
  children: [
    {
      path: 'prime-feature',
      canMatch: [featureAccessGuard],
      loadComponent: () =>
        import('./samples/can-match-guard/prime-feature/prime-feature.component').then(
          (m) => m.PrimeFeatureComponent
        ),
    },
  ],
},
```

Open the network panel, press **Open Prime Feature** while prime membership is off, and confirm that `prime-feature-component` is never requested. Toggle prime membership on and press it again: only now does the chunk arrive.
