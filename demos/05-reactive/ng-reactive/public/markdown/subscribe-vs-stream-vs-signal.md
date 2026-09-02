# Subscribe vs Stream vs Signal

One `interval()` source, consumed three ways in the same component. The three numbers disagree on purpose, and the counter at the top is the reason.

## The source is cold

```typescript
private ticks$ = defer(() => {
  this.sourceSubscriptions.update((count) => count + 1);
  return interval(1000);
}).pipe(map(...), scan(...), finalize(() => this.sourceSubscriptions.update((count) => count - 1)));
```

A cold Observable does its work **per subscriber**. Three consumers means three intervals, three independent random walks, three different numbers on screen. Toggle "render a second `| async` binding" and the counter goes from 3 to 4.

Adding `share()` to the pipe collapses all of them onto one subscription, and the three numbers become identical. That single operator is the difference between a source and a broadcast, and forgetting it is the most common cause of duplicate HTTP requests in an Angular codebase.

## 1. subscribe()

```typescript
this.ticks$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
  this.manual.set(value);
});
```

You own the teardown. Press "unsubscribe the manual one" and watch the counter drop; forget `takeUntilDestroyed()` in real code and it never drops, because the subscription outlives the component. You also write into state by hand, which means the state and the stream can drift apart.

## 2. Stream plus async pipe

```html
{{ stream$ | async }}
```

The template subscribes and unsubscribes for you. It reads fine for a plain stream, but the value is only available inside the template: you cannot feed it into a `computed()`, and **every** `| async` is another subscription to the same source. The toggle in the demo proves it.

## 3. toSignal()

```typescript
protected fromSignal = toSignal(this.ticks$, { initialValue: 0 });
```

One subscription however many times you read it, synchronous access, automatic teardown, and it composes with `computed()` and `effect()`. This is the default in Angular 22.

## When RxJS still wins

The source itself. `interval`, `fromEvent`, websockets, retry and backoff, and every operator that reasons about time are RxJS work. Signals are the consumption end, not a replacement for the stream.

## Watch out

`toSignal()` over an HTTP call is an anti-pattern in this repository. Use `httpResource()` or `rxResource()` for HTTP: see the `rxresource-vs-switchmap` demo.
