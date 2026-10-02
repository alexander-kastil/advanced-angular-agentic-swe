# Guarding Routes with canMatch

A guard keeps a signed-out user away from a screen. It is a usability feature: the API still
rejects the data calls, because a guard runs in code the user controls.

## Why canMatch

`canActivate` runs after the router matched the route, so the lazy chunk is already downloading.
`canMatch` runs during matching; when it refuses, the router never loads the component. It replaces
the deprecated `canLoad` from the module-based version of this demo.

```typescript
export const authGuard: CanMatchFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  const attempted = router.currentNavigation()?.extractedUrl.toString() ?? '/';
  auth.rememberReturnUrl(attempted);
  return router.createUrlTree(['/demos/app-auth-flow']);
};
```

Returning a `UrlTree` redirects. Returning `false` would leave the user on the current page with no
explanation, or try the next route with the same path.

## Register it

```typescript
{
  path: 'protected-area',
  canMatch: [authGuard],
  loadComponent: () =>
    import('./samples/auth-guard/protected-area/protected-area.component')
      .then((m) => m.ProtectedAreaComponent)
}
```

`router.currentNavigation()` is the signal that replaced `getCurrentNavigation()` in Angular 20.2.

## Run the demo

1. Open DevTools on the Network tab, then open **Guarding Routes with canMatch** while signed out.
2. Click **Open /demos/protected-area**. You land on the sign-in page and no `protected-area` chunk
   appears in the Network tab.
3. Sign in there. The sign-in page sends you back to `/demos/protected-area`, and only now does the
   chunk load.

Expected result: the protected page greets you by name and shows the seconds left on the token.

## What a guard does not do

It runs once per navigation. A token that expires while the user sits on the protected page does
not throw them out; the next API call returns 401 and the next navigation hits the guard. Handle the
401 in an interceptor if the app must react immediately.

## Test it

```typescript
const run = () => TestBed.runInInjectionContext(() => authGuard({}, [], {} as Parameters<CanMatchFn>[2]));

it('redirects to the login page when nobody is signed in', () => {
  const result = run() as UrlTree;
  expect(TestBed.inject(Router).serializeUrl(result)).toBe('/demos/app-auth-flow');
});
```
