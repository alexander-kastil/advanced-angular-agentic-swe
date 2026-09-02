# Advanced Routing and App Initialization

This module covers the Angular router alongside dependency injection and application bootstrapping. You configure startup work with `provideAppInitializer` and `injectAsync`, declare services with the new `@Service` decorator, chain functional HTTP interceptors, catch navigation failures with `withNavigationErrorHandler` and everything else with a custom `ErrorHandler`, bind route and query parameters straight into signal inputs, feed a route-scoped SignalStore from the URL, preload lazy routes selectively, stack functional guards, animate elements and navigations without `@angular/animations`, and expose navigation to an AI agent as WebMCP tools.

Run the app from `routing-app-init`. Start the mock API first:

```
json-server db.json
```

```
npm start
```

## Demos

| #   | Route | Title | Teaches | Topic |
| --- | --- | --- | --- | --- |
| 1 | `app-init` | App Initialization & inject | Run startup logic before bootstrap with provideAppInitializer and read the loaded configuration from a service resolved with inject(). | App Initialization |
| 2 | `app-initializer-async` | Async App Initializer | Await a lazily imported service during bootstrap by combining provideAppInitializer with injectAsync, and prefetch the same chunk on idle from a component. | App Initialization |
| 3 | `service-migration` | Service Decorator & Migration | Replace @Injectable with the @Service decorator, scope a service to a single route with autoProvided:false, and run the 22.1 service-migration schematic. | App Initialization |
| 4 | `http-errors` | Error Handling | Catch and transform HTTP failures in an interceptor, and route everything an interceptor misses through the global ErrorHandler token. | Error Handling |
| 5 | `multi-interceptor` | HTTP Interceptors | Chain multiple functional interceptors for auth headers, retries and error mapping in one provideHttpClient call. | Error Handling |
| 6 | `navigation-errors` | Navigation Errors | Record and redirect failed navigations with withNavigationErrorHandler, and catch everything else in a custom ErrorHandler class. | Error Handling |
| 7 | `router-bindings` | Component Input Bindings | Bind route and query parameters straight into signal inputs with withComponentInputBinding, keeping component state and URL in sync without ActivatedRoute. | Routing |
| 8 | `route-inputs` | Route Input Bindings | Configure withComponentInputBinding with its options object, and see why paramsInheritanceStrategy defaulting to always makes child routes inherit parent parameters and data. | Routing |
| 9 | `route-titles` | Route Titles | Set dynamic page titles for each route using the title property in route configuration. Update browser tab titles automatically. | Routing |
| 10 | `route-resolvers-signals` | Route Resolvers with Signals | Preload route data with an HTTP ResolveFn and receive it in a required signal input, type-safe and auto-unwrapped, with no subscription in the component. | Routing |
| 11 | `can-match-guard` | CanMatch Guard | Use canMatch guards to conditionally load routes based on runtime conditions. Prevent route initialization before matching. | Routing |
| 12 | `multi-guard` | Route Guards | Stack multiple route guards to enforce authorization policies. Combine authentication and role-based access control. | Routing |
| 13 | `preloading-strategy` | Preloading Strategy | Implement custom preloading strategies to eager-load routes in the background. Optimize performance with selective preloading. | Routing |
| 14 | `route-driven-store` | Route Driven Signal Store | Feed a route-scoped NgRx SignalStore from route params bound as signal inputs, so the URL is the only writer of the filter state. | Routing |
| 15 | `router-animations` | Router Animations | Animate entering and leaving elements with animate.enter and animate.leave, and let withViewTransitions animate navigation, all without @angular/animations. | Routing |
| 16 | `animate-enter-leave` | Animate Enter and Leave | Animate routed components in and out with animate.enter and animate.leave while withViewTransitions cross-fades the surrounding page. | Routing |
| 17 | `view-transitions` | View Transitions | Leverage native View Transitions API for seamless animated navigation. Create shared element animations across route changes. | Routing |
| 18 | `webmcp-navigation` | WebMCP Navigation Tools | Expose application navigation to an AI agent as WebMCP tools declared with declareExperimentalWebMcpTool, scoped to the component that owns them. | Agentic Interfaces |

## Reference

### Application configuration

Everything the app needs is registered in `src/app/app.config.ts`. The router carries four features, and the HTTP client carries three interceptors in order.

```typescript
provideHttpClient(
  withInterceptors([
    authInterceptor,
    retryInterceptor({ count: 3, delay: 1000 }),
    httpErrorInterceptor,
  ])
),
provideRouter(
  appRoutes,
  withComponentInputBinding({ queryParams: true, unmatchedInputBehavior: 'alwaysUndefined' }),
  withViewTransitions(),
  withPreloading(SelectivePreloadingStrategy),
  withExperimentalAutoCleanupInjectors(),
  withNavigationErrorHandler((error: NavigationError) => {
    inject(ErrorLogService).record('NavigationError', error.error?.message ?? String(error.error));
    return new RedirectCommand(inject(Router).parseUrl('/demos/navigation-errors'));
  })
),
provideZonelessChangeDetection(),
```

Angular 22 uses the Fetch backend by default, so neither `withFetch()` nor `withXhr()` appears here, and the app runs zoneless with no `zone.js` polyfill.

### Startup

Four initializers run before the first render. The last one awaits a service that is not in the initial bundle:

```typescript
provideAppInitializer(async () => {
  const log = inject(StartupLogService);
  const loadFlags = injectAsync(() =>
    import('./demos/samples/app-initializer-async/remote-flags.service').then(
      (m) => m.RemoteFlagsService
    )
  );

  log.record('initializer started, requesting the lazy flags service');
  const flags = await loadFlags();
  await flags.load();
  log.record(`flags resolved: ${flags.enabled().join(', ')}`);
}),
```

`inject()` and `injectAsync()` are both called before the first `await`, because the injection context ends at the first suspension point. The getter `injectAsync` returns has already captured the injector, so it can be called afterwards.

### Services

New services use the `@Service` decorator. `@Service()` is auto-provided; `@Service({ autoProvided: false })` is scoped by whichever `providers` array lists it, and a route is a natural owner.

```typescript
{
  path: 'service-migration',
  component: ServiceMigrationComponent,
  providers: [RouteScopedNotesService],
}
```

Convert an existing codebase with the schematic, which skips classes still using constructor injection:

```
ng generate @angular/core:service-migration
```

Route-scoped state only resets on re-entry because `withExperimentalAutoCleanupInjectors()` is enabled. Without it the router keeps one `EnvironmentInjector` per `Route` config for as long as the config is loaded, and a service listed in `providers` outlives every deactivation.

### Guards

A guard is a function that runs in an injection context. When the state it reads is a signal, the guard is synchronous and returns a plain boolean.

```typescript
export const onlyAuthenticatedGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const sns = inject(SnackbarService);

  if (auth.isAuthenticated()) {
    return true;
  }

  sns.displayAlert('No Access', 'Access only for authenticated users');
  return false;
};
```

`canMatch` decides whether a route matches at all, so a failing `canMatch` guard means the lazy chunk is never downloaded. `canActivate` runs after the chunk has loaded and only blocks activation.

`CanMatchFn` takes three arguments. The third, `PartialMatchRouteSnapshot`, carries the `params`, `queryParams`, `data`, `fragment` and `paramMap` that are already known while matching, which is everything an `ActivatedRouteSnapshot` would give except what only exists after activation.

```typescript
type CanMatchFn = (
  route: Route,
  segments: UrlSegment[],
  currentSnapshot: PartialMatchRouteSnapshot,
) => MaybeAsync<GuardResult>;
```

### Route data into components

`withComponentInputBinding()` writes path parameters, query parameters, `data` and resolved values into matching `input()` signals. Query parameters arrive as strings, so coerce them in an input `transform`.

```typescript
readonly page = input(1, { transform: (value: string | number) => Number(value) || 1 });
```

Its options object carries two defaults: `queryParams: true` binds query parameters, and `unmatchedInputBehavior: 'alwaysUndefined'` overwrites an unmatched input with `undefined` on every navigation so stale values cannot survive. Use `'undefinedIfStale'` when a component mixes router-bound inputs with inputs a parent template sets.

`paramsInheritanceStrategy` defaults to `'always'` in Angular 22, so every child route inherits its ancestors' parameters, `data` and resolved values whatever its own path looks like. `withRouterConfig({ paramsInheritanceStrategy: 'emptyOnly' })` restores the pre-22 behaviour.

### Animations

`@angular/animations` is not installed. Entering and leaving elements name a CSS class:

```html
<div animate.enter="slide-in" animate.leave="slide-out">...</div>
```

Navigation itself is animated by `withViewTransitions()`, styled through `::view-transition-old(root)` and `::view-transition-new(root)` in `src/theme/view-transition.scss`. The two compose: view transitions cross-fade the page, `animate.enter` and `animate.leave` animate one element on its own path. A routed component only animates out when the outlet's component actually changes, so two child routes sharing one component reuse the instance and never fire `animate.leave`.

### WebMCP

Angular 22 exposes `declareExperimentalWebMcpTool` and `provideExperimentalWebMcpTools` from `@angular/core`, and `provideExperimentalWebMcpForms` from `@angular/forms/signals`. No polyfill package is used. A tool declared in a component's injection context is registered on creation and unregistered on destroy, so an agent can drive navigation only while that page is open. Without `document.modelContext` or `navigator.modelContext` the registration is a silent no-op and the page behaves normally.

### Mock authentication

`AuthFacade` keeps the mock session in one signal and exposes `user`, `token`, `isAuthenticated` and `isPrimeMember` as `computed()`. Guards, the auth interceptor and the demo components all read those signals directly.
