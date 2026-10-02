# Root store composition

How to design application state so a **single composed signal store fully serves the app** — state *and* data access — with components binding to it directly or through a container/presenter split. The only things that stay outside the store are auth (MSAL), cross-cutting utility services, and deliberately backend-less caches.

Reference implementations: `src/ui/src/app/store/app.store.ts` (this repo), `citythong-members/.../store/members.store.ts`, `vouchers-ai/.../store/vouchers.store.ts`.

## Core shape

One `signalStoreFeature()` per domain, composed into a single root `signalStore({ providedIn: 'root' })`.

```ts
// store/app.store.ts
export const AppStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withState(initialAppState),   // base shell state (testing, invited, …)
  withMethods(/* base methods */),
  withActivity(),               // cross-cutting slices first (see angular-activity-indicator)
  withSidenav(),
  withTasks(),                  // task authoring AND the task planner live in ONE slice
  withPlanning(),               // scheduling grid, mailing AND timesheet — one planning domain
  withResources(),
  // …one with<Domain>() per feature area
);
```

Rules:
- **One file per domain:** `store/features/with-<domain>.feature.ts`, colocated `with-<domain>.spec.ts`.
- Each feature = `withState` (+ `withComputed` for derived signals) + `withMethods`.
- State mutations go through `patchState(store, { … })` — never assign signals directly.
- Compose everything into ONE root store. Do **not** create parallel `providedIn: 'root'` domain stores or services-with-`BehaviorSubject`.

Back to the index: [angular-signal-store-design](angular-signal-store-design.md)

## Reaching a sibling method, and reaching another slice's private member

Two failures with the same shape, one loud and one silent.

**A sibling inside `withMethods` is reached through a hoisted local, never through `store`.** The
`store` parameter's type does not carry the methods the object literal is still creating, so this
fails with `TS2551`, and because it is a type error it blocks the whole test run for everyone sharing
the checkout:

```ts
withMethods((store, service = inject(Svc)) => ({
  loadThings: rxMethod<Args>(pipe(...)),
  loadThingsForToday() {
    store.loadThings(resolveWindow(today));   // TS2551: does not exist on type
  },
}))
```

Declare it beside the factory's other locals and return the shorthand:

```ts
withMethods((store, service = inject(Svc)) => {
  const loadThings = rxMethod<Args>(pipe(...));
  return {
    loadThings,
    loadThingsForToday() { loadThings(resolveWindow(today)); },
  };
})
```

**When code outside a slice needs something the composed store does not expose, widen the owner's
public surface. Never cast into a private member.** `withProps` members are not carried into the
composed store's inferred public type, which tempts:

```ts
const res = (root as unknown as { _resource: { isLoading(): boolean } })._resource;   // no
```

That is an unchecked cross-slice contract: it compiles, it breaks silently when the owner changes, and
these accumulate into a dozen of them. The fix is a `computed` in the slice that owns the resource,
returned from its `withComputed` block and read by name.
