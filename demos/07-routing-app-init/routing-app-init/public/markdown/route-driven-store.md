# A SignalStore Driven by Route Parameters

## The shape

Three pieces, each with one job:

1. The route carries the filter: `route-driven-store/:category` plus a `q` query parameter.
2. `withComponentInputBinding()` turns both into signal inputs on the component.
3. A `signalMethod` on the store consumes those inputs, so the URL is the only writer of store state.

The component holds no state of its own and no subscription.

## The store

```typescript
export const CatalogStore = signalStore(
  withState({ items: catalog, category: 'all', q: '', applied: 0 }),
  withComputed((store) => ({
    categories: computed(() => ['all', ...new Set(store.items().map((item) => item.category))]),
    visible: computed(() => { ... }),
  })),
  withMethods((store) => ({
    applyRouteFilter: signalMethod<CatalogFilter>(({ category, q }) => {
      patchState(store, { category, q, applied: store.applied() + 1 });
    }),
  })),
);
```

`signalStore()` without a `{ providedIn: 'root' }` config produces a plain injectable class, which is what makes it scopeable:

```typescript
{
  path: 'route-driven-store/:category',
  component: RouteDrivenStoreComponent,
  providers: [CatalogStore],
}
```

The store lives and dies with the route. Navigate away and the filter state goes with it, which is usually what you want for a screen-local store.

## Feeding it from the route

```typescript
readonly category = input<string | undefined>('all');
readonly q = input<string | undefined>('');

private readonly routeFilter = computed(() => ({
  category: this.category() ?? 'all',
  q: this.q() ?? '',
}));

constructor() {
  this.store.applyRouteFilter(this.routeFilter);
}
```

The `| undefined` and the `??` are not defensive noise. `unmatchedInputBehavior` defaults to `'alwaysUndefined'`, so on a URL with no `?q=` the router writes `undefined` over the input's own default. Declaring `input('')` and reading `this.q().toLowerCase()` throws on the first navigation. Every router-bound input either carries a `transform` that absorbs `undefined` or is typed to admit it.

`signalMethod` accepts either a value or a signal. Handed a signal it sets up an effect in the current injection context and calls the processing function whenever the signal changes, so one call in the constructor covers every future navigation. That is why the "patched" counter increments once per navigation rather than once per template render.

Two inputs are folded into a single `computed()` first so that a navigation changing both `category` and `q` patches the store once, not twice.

## Why not an effect

```typescript
constructor() {
  effect(() => this.store.applyFilter(this.category(), this.q()));  // avoid
}
```

It works, but `signalMethod` says the same thing with less: the tracking is owned by the store method, the component does not import `effect`, and the method is still callable with a plain value from a test or from another caller that has no signal to give.

## Why the URL and not a setter

- Back and forward re-run the filter for free.
- The filtered view is a link somebody can paste into a chat.
- A reload restores the exact screen.
- There is exactly one writer, so there is no state to reconcile between the URL and the store.

Writes go through `router.navigate`, never through `patchState` from the template:

```typescript
selectCategory(category: string) {
  this.router.navigate(['/demos/route-driven-store', category], { queryParamsHandling: 'preserve' });
}
```
