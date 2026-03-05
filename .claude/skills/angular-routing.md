# Angular Routing (v21+)

## Setup

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()), // enables route params as signal inputs
  ],
};

// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'settings', loadComponent: () => import('./settings.component').then(m => m.Settings) },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes) },
  { path: '**', component: NotFound },
];
```

## Route Params as Signal Inputs (preferred)

```typescript
// Route: { path: 'users/:id', component: UserDetail }
export class UserDetail {
  id = input.required<string>();          // route param
  q = input<string>('');                  // query param
  user = input.required<User>();          // resolved data
}
```

## Functional Guards

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

// Factory guard with params
export const roleGuard = (roles: string[]): CanActivateFn => (route, state) => {
  const role = inject(AuthService).currentUser()?.role;
  return role && roles.includes(role) ? true : inject(Router).createUrlTree(['/unauthorized']);
};

// Can deactivate
export const unsavedChangesGuard: CanDeactivateFn<{ canDeactivate: () => boolean }> =
  (component) => component.canDeactivate() || confirm('Leave with unsaved changes?');
```

## Resolvers

```typescript
export const userResolver: ResolveFn<User> = (route) =>
  inject(UserService).getById(route.paramMap.get('id')!);

// Route:
{ path: 'users/:id', component: UserDetail, resolve: { user: userResolver } }
```

## Nested Routes

```typescript
{
  path: 'products',
  component: ProductsLayout,
  providers: [ProductService], // scoped to this route tree
  children: [
    { path: '', component: ProductList },
    { path: ':id', component: ProductDetail },
    { path: ':id/edit', component: ProductEdit, canDeactivate: [unsavedChangesGuard] },
  ],
}
```

## Programmatic Navigation

```typescript
private router = inject(Router);
this.router.navigate(['/products', id]);
this.router.navigate(['/search'], { queryParams: { q: query } });
this.router.navigate(['edit'], { relativeTo: this.route });
```

## Router Events as Signal

```typescript
isNavigating = toSignal(
  inject(Router).events.pipe(
    filter(e => e instanceof NavigationStart || e instanceof NavigationEnd),
    map(e => e instanceof NavigationStart)
  ),
  { initialValue: false }
);
```
