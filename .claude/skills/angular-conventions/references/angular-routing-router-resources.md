# Router Resources

> **EXPERIMENTAL: requires `@angular/router` 22.2+.** APIs carry the `ɵ` prefix and may change.
> Until the app is on 22.2, keep using resolvers ([angular-routing-route-data](angular-routing-route-data.md)).
> Remove this marker once the app runs Angular 22.2 or later.

Source: Manfred Steyer, [Router Resources: Loading Data with the Angular Router](https://www.angulararchitects.io/en/blog/router-resources-loading-data-with-the-angular-router/) (Angular 22.2.0-next.5).

A route declares its data as ordinary `Resource`s; the router owns their lifecycle and binds them to component inputs.

## Why over resolvers

| | Resolvers | Router Resources |
| --- | --- | --- |
| Along the route hierarchy | Sequential (parent 2 s + child 3 s = 5 s) | Parallel (3 s) |
| Reload | Re-navigate | `reload()` on the one resource, route stays active |
| Loading state in component | None (navigation waits) | Optional, via `nonBlocking` |
| Param change on reused route | Re-run resolver | `ResourceContext` params, query params and data are Signals |

## Setup

```typescript
import {
  ɵwithRouterResources as withRouterResources,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding(), withRouterResources())],
};
```

Augment the router types so `resources` compiles:

```typescript
declare module '@angular/router' {
  interface Route {
    resources?: (ctx: ResourceContext) => ResourceResult | Promise<ResourceResult>;
  }

  interface ActivatedRoute {
    resources?: Record<string, Resource<unknown> & { reload(): boolean }>;
  }
}
```

## Blocking (default)

Navigation waits for the value; the component input receives it unwrapped.

```typescript
{
  path: 'passenger-edit/:id',
  component: PassengerEdit,
  resources: (ctx) => ({
    passenger: createSimplePassengerResource(ctx.params),
  }),
}

export function createSimplePassengerResource(params: Signal<Params>) {
  const passengerClient = inject(PassengerClient);
  const id = computed(() => Number(params()['id'] ?? 0));
  return passengerClient.findPassengerResourceById(id, {
    withDefaultValue: false,
  });
}

export class PassengerEdit {
  protected readonly passenger = input.required<Passenger>();
}
```

**Gotcha:** a resource with a default value never blocks, because the router already sees a value. Blocking needs `withDefaultValue: false` (or no `defaultValue`).

## Non-blocking

The route activates immediately; the input receives the whole `Resource`.

```typescript
import { ɵnonBlocking as nonBlocking } from '@angular/router';

{
  path: ':id',
  component: LuggageDetail,
  resources: (ctx) => ({
    luggage: nonBlocking(createLuggageResource(ctx.params)),
  }),
}

export class LuggageDetail {
  readonly luggage = input.required<Resource<Luggage | undefined>>();
}
```

```html
@let resource = luggage();
@let item = resource.value();
@if (resource.isLoading()) {
  <p>Loading luggage ...</p>
} @else if (resource.error()) {
  <p>Luggage could not be loaded.</p>
} @else if (item) {
  <form> [...] </form>
}
```

## Reload without navigating

```typescript
private readonly passengerResource = inject(ActivatedRoute).resources?.['passenger'];

protected reload(): void {
  this.passengerResource?.reload();
}
```

## Redirect on missing data

Throw a `RedirectCommand` from the loader. Blocking resources only: a non-blocking route has already activated.

```typescript
export function createPassengerResource(params: Signal<Params>) {
  const passengerClient = inject(PassengerClient);
  const router = inject(Router);

  return resource({
    params: () => Number(params()['id'] ?? 0),
    loader: async ({ params: id }) => {
      try {
        return await firstValueFrom(passengerClient.findById(String(id)));
      } catch (error) {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          throw new RedirectCommand(router.parseUrl('/not-found'));
        }
        throw error;
      }
    },
  });
}
```

## With a Signal Store

No settled pattern yet. Three options:

**Wrapper resource** that drives the store and waits for it:

```typescript
export function createStorePassengerResource(params: Signal<Params>) {
  const store = inject(PassengerDetailStore);
  const passengerLoaded = waitFor(store.passengerIsLoading, false);

  return resource({
    params: () => Number(params()['id'] ?? 0),
    loader: async ({ params: id, abortSignal }) => {
      store.setPassengerId(id);
      await passengerLoaded(abortSignal);
      return store.passengerValue();
    },
  });
}
```

**Shared resource**: the store exposes its own resource and the factory returns it.

```typescript
export const PassengerStore = signalStore(
  { providedIn: 'root' },
  withState({ passengerId: 0 }),
  withProps((store) => {
    const _passenger = inject(PassengerClient).findPassengerResourceById(store.passengerId, {
      withDefaultValue: false,
    });
    return { _passenger, passenger: _passenger.asReadonly() };
  }),
  withMethods((store) => ({
    load: signalMethod<number>((id) => patchState(store, { passengerId: id })),
  })),
);

export function createSharedPassengerResource(params: Signal<Params>) {
  const store = inject(PassengerStore);
  const id = computed(() => Number(params()['id'] ?? 0));
  store.load(id);
  return store.passenger;
}
```

**Guard only** (non-blocking): no router resource at all.

```typescript
export const passengerGuard: CanActivateFn = (route) => {
  const store = inject(PassengerDetailStore);
  store.setPassengerId(Number(route.paramMap.get('id') ?? 0));
  return true;
};
```

Back to the index: [angular-routing](angular-routing.md)
