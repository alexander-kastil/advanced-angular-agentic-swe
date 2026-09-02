# Route Input Bindings and Parameter Inheritance

## The options object

`withComponentInputBinding()` accepts a `ComponentInputBindingOptions` object. Both fields have defaults, so passing nothing is the same as passing the values below:

```typescript
provideRouter(
  appRoutes,
  withComponentInputBinding({
    queryParams: true,
    unmatchedInputBehavior: 'alwaysUndefined',
  }),
),
```

| Option | Default | Effect |
| --- | --- | --- |
| `queryParams` | `true` | Query parameters are bound to matching inputs. Set to `false` when a component should only see path parameters, `data` and resolved values. |
| `unmatchedInputBehavior` | `'alwaysUndefined'` | An input with no matching router key is set to `undefined` on every navigation, so stale values can never survive. `'undefinedIfStale'` only writes `undefined` if the input was populated by the router earlier in this outlet's lifetime. |

The `draftTitle` input in this demo declares a component-level default and is never matched by a route key. With the default behaviour the router overwrites that default with `undefined`, which is exactly what the table above describes. `'undefinedIfStale'` is the setting to reach for when a component mixes router-bound inputs with inputs that a parent template sets.

This bites on optional query parameters, not just on inputs nobody binds. `readonly q = input('')` on a URL with no `?q=` yields `undefined`, not `''`, so `this.q().toLowerCase()` throws on the very first navigation. Either type the input to admit `undefined` and coerce at the point of use, or give it a `transform` that absorbs it:

```typescript
readonly q = input('', { transform: (value: string | undefined) => value ?? '' });
```

## Four sources, one kind of input

The router writes path parameters, query parameters, static `data` and resolved values into inputs of the same name. Nothing in the component distinguishes them:

```typescript
readonly tenant = input.required<string>();   // :tenant path parameter
readonly release = input('');                  // data: { release: '22.1' }
readonly highlight = input('');                // ?highlight=...
readonly draftTitle = input<string | undefined>('set in the component');
```

Because a name collision is resolved in favour of the router, keep route keys and unrelated inputs distinct.

## paramsInheritanceStrategy now defaults to 'always'

In Angular 22 `paramsInheritanceStrategy` defaults to `'always'`. Every route inherits the parameters, `data` and resolved values of its ancestors, whatever its own path looks like.

```typescript
provideRouter(appRoutes, withRouterConfig({ paramsInheritanceStrategy: 'emptyOnly' })),
```

That call is how you get the pre-22 behaviour back: a route only inherited from its parent when its own path was empty, or when the parent route declared no component.

What changes in practice:

- A child route declaring `path: ':section'` also sees the parent's `:tenant` and the parent's `data`, with no configuration at all. The `InheritedParamsComponent` below does exactly that.
- `ActivatedRoute.snapshot.params` and `paramMap` in a deep route now contain ancestor parameters. Code that looped up through `route.parent` to collect them is redundant.
- A resolver keyed on the same name in a parent and a child now resolves to the child's value; the parent's is shadowed rather than lost.
- Guards see the merged set too, so a `canActivate` on a leaf can read a tenant id declared three levels up.

The one thing to watch is an accidental name collision between an ancestor parameter and a child input. Under `'emptyOnly'` such a collision was usually invisible; under `'always'` the ancestor value now arrives.

## Matrix parameters

"Parent" means the parent `Route` config, not the URL segment to the left. When a route path spans several segments, matrix parameters must sit on the last one: for `{ path: 'a/b', component: MyComp }` write `a/b;foo=bar`, never `a;foo=bar/b`.
