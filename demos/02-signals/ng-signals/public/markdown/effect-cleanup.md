- Effects often set up resources (timers, listeners, subscriptions) that must be released when
  the effect re-runs or is destroyed. The effect function receives an `onCleanup` callback for
  exactly that:

```typescript
effect((onCleanup) => {
  if (!this.running()) {
    return;
  }
  const handle = setInterval(() => this.ticks.update((t) => t + 1), 500);
  onCleanup(() => clearInterval(handle));
});
```

- `onCleanup` runs **before the next execution** of the effect and once more when the effect is
  destroyed. Registering the teardown there, not returning it, is the Angular API.

- Common cleanup targets:
  - `clearInterval()` / `clearTimeout()` for timers
  - `removeEventListener()` for DOM listeners
  - `.unsubscribe()` for RxJS subscriptions
  - `AbortController.abort()` for in-flight requests

- An effect created in a constructor is tied to the component lifetime and needs no manual
  disposal. An effect created later needs an `Injector`, and `effect()` returns an `EffectRef`
  you can stop yourself:

```typescript
private injector = inject(Injector);
private onceRef: EffectRef | null = null;

armOnce() {
  this.onceRef = effect(() => {
    this.initLog.set(`ran once with value ${this.watched()}`);
    this.onceRef?.destroy();
    this.onceRef = null;
  }, { injector: this.injector });
}
```

- That is the one-shot pattern: the effect reads its dependencies, does its work, then destroys
  itself so later changes no longer trigger it. `destroy()` also runs the registered cleanups.

- Without cleanup you leak: timers keep ticking, listeners stay attached, subscriptions stay
  open long after the component is gone.
