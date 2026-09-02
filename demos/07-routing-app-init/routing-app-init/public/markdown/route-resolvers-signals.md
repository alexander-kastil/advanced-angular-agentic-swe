# Route Resolvers with Signals

## Overview

A `ResolveFn` runs before the route activates. The router waits for the returned observable or promise, then hands the value to the component. Combined with `withComponentInputBinding()` the component receives it as a required signal input, so it never renders a loading state and never subscribes.

## The resolver

Return the observable directly; the router subscribes for you.

```typescript
export interface Album {
  userId: number;
  id: number;
  title: string;
}

export const albumResolver: ResolveFn<Album> = (route) => {
  const http = inject(HttpClient);
  const id = route.paramMap.get('id') ?? '1';

  return http.get<Album>(`https://jsonplaceholder.typicode.com/albums/${id}`);
};
```

## Route configuration

```typescript
{
  path: 'route-resolvers-signals',
  pathMatch: 'full',
  redirectTo: 'route-resolvers-signals/1',
},
{
  path: 'route-resolvers-signals/:id',
  component: RouteResolversSignalsComponent,
  resolve: { album: albumResolver },
},
```

The key in the `resolve` map is the input name the value lands in.

## The component

```typescript
export class RouteResolversSignalsComponent {
  readonly id = input.required({ transform: (value: string | number) => Number(value) });
  readonly album = input.required<Album>();

  readonly previousId = computed(() => Math.max(1, this.id() - 1));
  readonly nextId = computed(() => this.id() + 1);
}
```

`id` comes from the path, `album` from the resolver, and both are signals, so `computed()` derives from them like any other state.

## Resolver or httpResource?

| Concern | `ResolveFn` | `httpResource()` |
|---|---|---|
| When it runs | before activation | after the component exists |
| Loading state | none, the route waits | `isLoading()` on the resource |
| Navigation is blocked | yes, until the call finishes | no |
| Best for | data the route cannot render without | data the page can load progressively |

Use a resolver when a half-rendered page would be wrong, and `httpResource()` when you would rather show the shell immediately.
