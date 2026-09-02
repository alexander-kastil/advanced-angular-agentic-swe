# Navigation Errors and the Global ErrorHandler

## Two different failure channels

A failure during navigation is not an unhandled application error. The router catches it, emits `NavigationError`, and rejects the navigation promise. Everything else, a throw inside a component method, a callback, a lifecycle hook, reaches the `ErrorHandler` token.

Wire both, or half the failures in the app go unreported.

## withNavigationErrorHandler

```typescript
provideRouter(
  appRoutes,
  withNavigationErrorHandler((error: NavigationError) => {
    inject(ErrorLogService).record('NavigationError', error.error?.message ?? String(error.error));
    return new RedirectCommand(inject(Router).parseUrl('/demos/navigation-errors'));
  }),
),
```

The handler runs inside the router's environment injection context, so `inject()` works directly in it.

What the return value decides:

- Return a `RedirectCommand` and the failure becomes a redirect. The router emits `NavigationCancel` with the cancellation code `Redirect` instead of `NavigationError`, and navigates where you pointed it.
- Return anything else, including `undefined`, and the router emits `NavigationError` and rethrows. The error continues to the `ErrorHandler`.

This demo takes the first branch, which is why pressing **Navigate into a failing resolver** leaves you on this page with a new row in the table instead of dropping you on the error page.

## The failing route

```typescript
export const brokenResolver: ResolveFn<never> = (route) => {
  throw new Error(`Resolver failed for segment "${route.routeConfig?.path}"`);
};
```

```typescript
{
  path: 'broken',
  component: BrokenPanelComponent,
  resolve: { data: brokenResolver },
},
```

The component is never constructed. A resolver that throws, a guard that throws, and a `loadComponent` whose import rejects all produce the same `NavigationError`.

## A custom ErrorHandler

`ErrorHandler` is a class token, so provide a class, not a function:

```typescript
@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  private injector = inject(Injector);

  handleError(error: Error | HttpErrorResponse) {
    const message = error.message ?? String(error);
    console.warn('An error occurred:', error);

    this.injector.get(ErrorLogService).record('ErrorHandler', message);
    this.injector.get(Router).navigate(['/error'], { state: { data: message } });
  }
}
```

```typescript
{ provide: ErrorHandler, useExisting: GlobalErrorHandler }
```

The handler injects `Injector` and resolves `Router` inside `handleError` rather than as a field. `ErrorHandler` is constructed very early, and taking a direct dependency on the router at that point is a good way to build a cycle. Resolving late costs one map lookup per error and removes the whole class of problem.

Press **Throw an unhandled error** to see it: the message is recorded, the app routes to `/error`, and coming back shows the entry still in the table.

## Ordering

1. A guard or resolver throws.
2. `withNavigationErrorHandler` runs. If it returns a `RedirectCommand`, the story ends there with a redirect.
3. Otherwise `NavigationError` is emitted on `router.events` and the error is rethrown.
4. `ErrorHandler.handleError` receives it.

Subscribing to `router.events` and filtering for `NavigationError` still works and is the right tool when several parts of the app want to observe failures. `withNavigationErrorHandler` is the right tool when one place should decide what happens next.
