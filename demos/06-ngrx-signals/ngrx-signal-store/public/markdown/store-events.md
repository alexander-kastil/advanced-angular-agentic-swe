## Overview

`@ngrx/signals/events` adds the part of classic NgRx worth keeping: one dispatched event, many independent reactions. A component states intent; reducers change state and event handlers run side effects, neither of them knowing about the component.

Examine `cart.events.ts` and `cart.store.ts`.

## Declaring Events

```typescript
export const cartEvents = eventGroup({
  source: 'Cart',
  events: {
    added: type<string>(),
    removed: type<string>(),
    cleared: type<void>(),
    checkoutStarted: type<void>(),
    checkoutFinished: type<number>(),
  },
});
```

`eventGroup()` produces typed creators whose `type` string is namespaced by `source`, so `cartEvents.added` becomes `[Cart] added`.

## Reducing with withReducer

A case reducer receives the event and the current state and returns a partial state, an updater, or an array of both:

```typescript
withReducer(
  on(cartEvents.added, ({ payload }, state) => ({
    lines: [...state.lines, payload],
    log: [`added ${payload}`, ...state.log],
  })),
  on(cartEvents.checkoutFinished, ({ payload }, state) => ({
    checkingOut: false,
    orderNumber: payload,
    lines: [],
    log: [`order ${payload} placed`, ...state.log],
  }))
)
```

One `on()` can list several events before the reducer, which is how `markdown-editor.store.ts` collapses `fetch`, `save` and `delete` into a single "start loading" case.

## Side Effects with withEventHandlers

A handler is an observable of events. Whatever it emits is dispatched:

```typescript
withEventHandlers((_, events = inject(Events)) => ({
  checkout$: events.on(cartEvents.checkoutStarted).pipe(
    delay(900),
    map(() => cartEvents.checkoutFinished(Math.floor(Math.random() * 9000) + 1000))
  ),
}))
```

The store never calls the checkout logic directly. It reduces `checkoutStarted` to `checkingOut: true`, and the handler answers with `checkoutFinished`, which the reducer picks up.

For HTTP work, pair the handler with `mapResponse` from `@ngrx/operators` so success and failure map to two different events. `markdown-editor.store.ts` in this app does exactly that.

## Dispatching from a Component

```typescript
protected dispatch = injectDispatch(cartEvents);
```

```html
<button mat-stroked-button (click)="dispatch.added(item)">+ {{ item }}</button>
```

`injectDispatch()` binds the whole group to the `Dispatcher`, so the template calls the event by name and passes the payload. No store method is involved.

## The Dispatcher Underneath

`injectDispatch()` is sugar over the `Dispatcher` service, which you can inject directly when the event or the scope is decided at runtime:

```typescript
protected dispatcher = inject(Dispatcher);

protected addScoped(item: string) {
  this.dispatcher.dispatch(cartEvents.added(item), { scope: this.scope() });
}
```

## Scoped Events

`Dispatcher` and `Events` are `providedIn: 'platform'`, so by default every store in the app shares one bus. `provideDispatcher()` in a component's `providers` creates a child pair, and the stores provided alongside it reduce only what stays in that scope:

```typescript
providers: [provideDispatcher(), CartStore],
```

The scope config decides where an event lands:

- no config, or `{ scope: 'self' }` — reduced by the local scope. The cart updates.
- `{ scope: 'parent' }` — forwarded one level up. The local cart store never sees it.
- `{ scope: 'global' }` — forwarded all the way to the root dispatcher.

Toggle the scope on the demo page and dispatch: with `parent` or `global` the event leaves this component, nothing there reduces `[Cart] added`, and the log stays unchanged. That is the mechanism behind a page-local store that can still tell the rest of the app something happened, without the rest of the app hearing its internal chatter.

`toScope()` and `mapToScope()` do the same thing from inside an event handler, where the scope is attached to the emitted event rather than passed at the call site.
