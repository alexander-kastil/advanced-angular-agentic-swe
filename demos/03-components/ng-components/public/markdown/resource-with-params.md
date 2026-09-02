# Resources with Parameters

A resource is a reactive read. It re-runs whenever a signal read inside its request changes, and it
never needs a subscription.

## httpResource parameterised by a signal input

The component that owns the request also owns the input it depends on:

```typescript
export class PetDetailComponent {
  readonly petId = input.required<number>();

  readonly pet = httpResource<Pet>(() => `${environment.api}pets/${this.petId()}`);

  reload() {
    this.pet.reload();
  }
}
```

The parent only writes the signal it passes down:

```html
<app-pet-detail [petId]="petId()" />
```

Changing `petId` in the parent invalidates the child's request and refetches. There is no
`ngOnChanges`, no `distinctUntilChanged`, and no in-flight request to cancel by hand: the previous
request is aborted for you.

## resource() with params, abortSignal and defaultValue

`httpResource()` is the HTTP-shaped convenience. `resource()` is the general form for anything that
returns a promise:

```typescript
readonly pets = resource<Pet[], { owner: string }>({
  params: () => ({ owner: this.owner() }),
  loader: async ({ params, abortSignal }) => {
    const response = await fetch(`${environment.api}pets?owner=${params.owner}`, {
      signal: abortSignal,
    });
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }
    return (await response.json()) as Pet[];
  },
  defaultValue: [],
});
```

| Option         | Purpose                                                                    |
| -------------- | -------------------------------------------------------------------------- |
| `params`       | the reactive request. Omit it and the loader runs once until you reload.    |
| `loader`       | returns a promise for the value. Gets `params`, `abortSignal` and `previous`. |
| `stream`       | alternative to `loader`, returns a signal that keeps emitting.              |
| `defaultValue` | what `value()` returns while loading or on error. Narrows the type.         |
| `equal`        | comparison used on the loaded value.                                        |

`loader` and `stream` are mutually exclusive.

## The surface

| Member         | Type                                                       |
| -------------- | ---------------------------------------------------------- |
| `value()`      | the loaded value, or the default value                     |
| `status()`     | `idle`, `loading`, `reloading`, `resolved`, `error`, `local` |
| `isLoading()`  | convenience over `status()`                                |
| `error()`      | the thrown error                                           |
| `reload()`     | re-runs the loader with the same params                    |
| `set()`/`update()` | writes a local value, status becomes `local`            |

## When params does not change but the data did

`reload()` is the escape hatch. Use it after a mutation, or behind a refresh button. It is the only
imperative call in the whole API, and it is the honest signal that something outside the request
changed.
