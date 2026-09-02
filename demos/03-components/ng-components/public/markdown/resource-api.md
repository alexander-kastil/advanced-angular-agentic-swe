# Resource API

`httpResource()` is the signal-native way to read data over HTTP. You describe the URL as a function of signals; Angular runs the request, tracks the dependencies and re-runs it whenever they change.

## The demo

```typescript
export class ResourceApiComponent {
  protected readonly petId = signal(1);

  protected readonly pet = httpResource<Pet>(() => `${environment.api}pets/${this.petId()}`);

  protected loadNext() {
    this.petId.update((id) => id + 1);
  }
}
```

`loadNext()` writes one signal. There is no fetch call, no loading flag and no error handler, because the URL function read `petId()` and the resource refetches on its own.

## What the resource exposes

```typescript
pet.value();      // Signal<Pet | undefined>
pet.status();     // 'idle' | 'loading' | 'reloading' | 'resolved' | 'error' | 'local'
pet.isLoading();  // Signal<boolean>
pet.error();      // Signal<unknown>
pet.reload();     // force a refetch with an unchanged URL
```

```html
@if (pet.isLoading()) { <app-progress-bar mode="indeterminate" /> }
@if (pet.error(); as error) { <p>{{ error }}</p> }
@if (pet.value(); as data) { <h3>{{ data.name }}</h3> }
```

## Options

Pass a request object instead of a bare URL when you need a method, headers or params:

```typescript
readonly search = httpResource<Pet[]>(() => ({
  url: `${environment.api}pets`,
  params: { type: this.type() },
}));
```

Returning `undefined` from the function makes the resource idle, which is how you express "do not load yet":

```typescript
readonly pet = httpResource<Pet>(() =>
  this.selectedId() ? `${environment.api}pets/${this.selectedId()}` : undefined
);
```

Sub-constructors parse other response types: `httpResource.text()`, `httpResource.blob()`, `httpResource.arrayBuffer()`.

## resource() vs httpResource()

`resource()` is the generic form and takes any async loader, so use it for IndexedDB, the file system access API, a WebSocket handshake or an SDK call. When the source is HTTP, `httpResource()` is the shorter and better-typed path.

```typescript
readonly config = resource({
  params: () => ({ key: this.key() }),
  loader: ({ params }) => loadFromIndexedDb(params.key),
});
```

## Why not the alternatives

| Approach | Problem |
| --- | --- |
| `.subscribe()` in the component | you own the subscription lifetime by hand |
| `obs$ \| async` | no status, no error signal, one subscription per usage in the template |
| `toSignal(http.get(...))` | fires once, never refetches, hides loading and error state |

## Running the demo

The pets come from json-server:

```bash
json-server db.json
```
