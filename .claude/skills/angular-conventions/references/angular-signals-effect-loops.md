# Effect Request Storms

### Gotcha: effects track EVERY synchronous read, including hidden ones inside called methods

An `effect()`/`computed()` records a dependency on **every** signal read during its synchronous run — not just the ones you named at the top, but any incidental read deep inside a method, service, or HTTP interceptor it calls on the same call stack. If that same signal is then written as a side effect, the effect reschedules itself → **infinite loop** (under zoneless change detection this hangs the browser).

Classic trigger: an `effect()` that fires an HTTP request, where a global "activity"/"loading" interceptor reads-then-writes a shared `pendingRequests` (or `isBusy`) signal on every request. The effect silently takes a dependency on that counter; its own request bumps it, which reschedules the effect, which fires another request — a self-sustaining request storm independent of the data.

**Rule:** read your intended dependency signals explicitly at the top of the effect, then wrap any side-effecting call (anything that issues HTTP or otherwise touches shared store signals) in `untracked()`:

```typescript
onChange = effect(() => {
  const id = this.selectedId();          // real deps, read tracked
  if (id) {
    untracked(() => this.loadDetails());  // side effect — do NOT track its internal reads
  }
});
```

Symptom to recognize: an endless stream of identical requests in the network/API console after a component with an `effect()` mounts, where the effect's named dependencies never actually change value.

### Variant: an `rxMethod` called with a plain value runs its pipe inside the effect

`rxMethod<T>(pipe)` called with a non-signal argument does `source$.next(value)` synchronously, so every signal the pipe reads before its first async boundary (typically a `filter((v) => v !== store.requestedKey())` dedupe guard) is tracked by the calling effect. If the error branch resets that key (`patchState(store, { requestedKey: null })`), each failed request reschedules the effect, which calls the method again: a retry loop that only appears while the backend fails, and that pins a global loading bar on because start/finalize alternate with no idle frame.

```typescript
effect(() => {
  const horizonTo = this.store.focusDateIso();
  untracked(() => this.store.loadCashAccounts(horizonTo));
});
```

Prove it: with the API stopped, chrome-devtools `list_network_requests` shows the method's endpoints repeating dozens of times per 10 s while every other endpoint fires once; a Vitest that flushes one failed request and asserts no second request fails without the `untracked()`. Search the store for siblings with the same shape (a dedupe key read in the pipe and reset on error) and fix them in the same pass.

Back to the index: [angular-signals](angular-signals.md)
