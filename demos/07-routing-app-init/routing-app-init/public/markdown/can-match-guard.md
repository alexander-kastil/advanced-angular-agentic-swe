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
