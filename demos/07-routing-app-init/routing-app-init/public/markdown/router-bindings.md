# Component Input Bindings and Query Parameters

## Binding route state into signal inputs

`withComponentInputBinding()` makes the router write path parameters, query parameters, `data` and resolved values into matching `input()` signals of the routed component.

```typescript
provideRouter(
  appRoutes,
  withComponentInputBinding(),
),
```

The component then declares inputs and nothing else. No `ActivatedRoute`, no subscription, no manual parsing:

```typescript
export class RouterBindingsComponent {
  readonly q = input('', { transform: (value: string | undefined) => value ?? '' });
  readonly page = input(1, { transform: (value: string | number | undefined) => Number(value) || 1 });
  readonly showRecent = input(true, {
    transform: (value: string | boolean | undefined) => value !== 'false' && value !== false,
  });
}
```

Query parameters always arrive as strings, so an input `transform` is the right place to coerce them. The transform also has to accept `undefined`: `unmatchedInputBehavior` defaults to `'alwaysUndefined'`, so the router overwrites an input whose parameter is absent from the URL rather than leaving the component's own default in place.

## Writing the parameters back

Navigation is the only way to change the state, which keeps the URL authoritative:

```typescript
private navigate(queryParams: Record<string, unknown>) {
  this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
}
```

`queryParamsHandling: 'merge'` keeps the parameters you do not mention. Passing `undefined` for a value removes that parameter.

## Why the URL is the state

- Back and forward buttons work with no extra code
- The view is shareable and bookmarkable
- A reload restores exactly what was on screen
- Derived state is a `computed()` over the inputs

```typescript
readonly queryState = computed(() => ({
  q: this.q(),
  page: this.page(),
  showRecent: this.showRecent(),
}));
```

Change the search box or press the paging buttons below and watch the address bar and the JSON block stay in step.
