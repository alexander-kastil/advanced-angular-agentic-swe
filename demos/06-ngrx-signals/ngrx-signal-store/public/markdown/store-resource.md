## Overview

Angular's `httpResource()` gives you `value()`, `status()`, `error()` and `reload()` for a request whose URL is a computation. `@ngrx/signals/resource` wraps that resource and changes how it behaves in the two awkward states: while reloading, and after an error.

Examine `store-resource.component.ts`.

## Extending a Resource

```typescript
protected readonly topics = extendResource(
  httpResource<Topic[]>(() => {
    const term = this.search().trim();
    return `${environment.api}topics${term ? `?name_like=${encodeURIComponent(term)}` : ''}`;
  }),
  withPreviousValueOnLoading(),
  withValueOnError([] as Topic[])
);
```

`extendResource()` returns the resource with its original type intact, so the template still calls `topics.value()`, `topics.status()` and `topics.reload()`.

## The Extensions

| Extension | Behaviour |
| --- | --- |
| `withPreviousValueOnLoading()` | keeps the last resolved value while the next request is in flight instead of resetting to `undefined` |
| `withValueOnLoading(value)` | supplies a fixed placeholder while loading |
| `withPreviousValueOnError()` | returns the last good value when the request fails instead of throwing on read |
| `withValueOnError(value)` | returns a fallback value when the request fails |

Extensions that share a type replace each other, so the last loading extension and the last error extension win.

## Reactive URL

The URL is a computation over `search()`. Typing in the filter box changes the signal, which re-runs the request. Without `withPreviousValueOnLoading()` the list would blank out on every keystroke.

## Scoped Defaults

`provideResourceExtensions()` registers extensions for an injector, so an application, a route or a component can set a house default and every `extendResource()` call inside that scope inherits it:

```typescript
providers: [provideResourceExtensions(withValueOnError([]))]
```

> Both APIs are marked experimental in `@ngrx/signals` 22.
