## Overview

A SignalStore is a list of features applied in order. This demo uses the three composition tools that are not about state: `withProps()`, `withFeature()` and `signalMethod()`.

Examine `watchlist.store.ts`, `with-audit.ts` and `quote.service.ts` next to the demo component.

## withProps: members that are not state

`withProps()` attaches anything to the store instance without putting it into the state object. Injected services and observables belong here, not in `withState()`:

```typescript
withProps(({ selected }) => ({
  quotes: inject(QuoteService),
  selected$: toObservable(selected),
}))
```

`store.quotes` is now available to every later `withMethods()` block, and `store.selected$` lets a consumer that needs RxJS bridge out without the store keeping a subscription. Props do not appear in `getState()` and are not patchable, which is the point: a service is not application state.

## withFeature: a feature that needs the store

A `signalStoreFeature()` normally knows nothing about the store it is mounted into. `withFeature()` hands it the store members declared so far:

```typescript
withFeature((store) => withAudit(store.desk))
```

`withAudit(source: () => string)` takes any function returning a string, and `store.desk` is a signal, so the feature stamps every log line with the current desk name without ever importing the state type.

This is how a generic feature stays generic. Without `withFeature()` you would have to pass the value at declaration time, before any store exists.

## signalMethod: a side effect bound to a signal

`rxMethod` needs RxJS. `signalMethod` is the signal-only equivalent: pass it a value and it runs once, pass it a signal and it re-runs on every change.

```typescript
refreshQuote: signalMethod<string>((symbol) => {
  const quote = store.quotes.quote(symbol);
  patchState(store, { quote });
  store.audit(`${symbol} quoted at ${quote}`);
}),
```

```typescript
withHooks({
  onInit(store) {
    store.refreshQuote(store.selected);
  },
})
```

Nothing in the component calls `refreshQuote`. It was bound to the `selected` signal once, in `onInit`, so selecting another symbol re-runs it. The returned `EffectRef` is tied to the store's injector and is destroyed with it.

## Order Is the Contract

Each feature only sees what came before it. `withProps()` must precede the `withMethods()` that uses `store.quotes`, and `withFeature()` must precede the methods that call `store.audit()`. Reordering the list is a compile error, not a runtime surprise.
