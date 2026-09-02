- `withComponentInputBinding()` binds route data straight onto a component's `input()` signals. One line of config, and `ActivatedRoute` disappears from the component.

```typescript
provideRouter(appRoutes, withComponentInputBinding())
```

```typescript
export class DishParamsComponent {
  readonly id = input.required<string>();
  readonly highlight = input('');

  readonly dish = httpResource<FoodItem>(() => `${environment.api}food/${this.id()}`);
}
```

- What it replaces:

```typescript
private readonly route = inject(ActivatedRoute);
private readonly id = toSignal(
  this.route.paramMap.pipe(map((params) => Number(params.get('id'))))
);
```

## What binds, and in what order

| Source | Example |
|---|---|
| Path params | `/food/:id` binds `id` |
| Query params | `?highlight=ws` binds `highlight` |
| Static route `data` | `data: { mode: 'compact' }` binds `mode` |
| Resolver results | a resolver keyed `dish` binds `dish` |

- Matching is **by input name**. Later sources win on a collision, so a query param shadows a path param of the same name.

- An input with no matching source keeps its declared default. That is why `highlight` reads `not set` until the query param appears, rather than throwing.

- `input.required()` with no source throws at runtime, which is the usual symptom of a missing `withComponentInputBinding()`.

## Why it matters more under SSR

- Signal inputs are populated **before** the first change detection pass, so a server-rendered component reads its params during that first pass and emits finished markup in one go.

- An `ActivatedRoute` subscription resolves a microtask later. On the server the first pass then renders an empty shell, and the hydrating client has to correct it, which is exactly the flicker hydration is meant to remove.

- Values arrive as **strings**. Convert deliberately:

```typescript
readonly id = input.required<string>();
readonly numericId = computed(() => Number(this.id()));
```

- Because the request function of `httpResource` reads `this.id()`, navigating from `/1` to `/2` refetches with no subscription, no `ngOnChanges` and no manual teardown.
