- `@angular/core/rxjs-interop` provides utilities to bridge RxJS Observables and Angular Signals:
    - `toSignal<T>(obs, { initialValue })` — wraps an Observable as a **read-only** signal
    - `toObservable<T>(signal)` — wraps a signal as a cold Observable

- `toSignal()` creates a read-only signal — to get a writable copy, use `effect()` with `allowSignalWrites: true`:

```typescript
amount$ = of(10);
amount = toSignal(this.amount$, { initialValue: 0 });
writeableAmount = signal(this.amount());

createWriteAmount = effect(() => {
  this.writeableAmount.set(this.amount());
}, { allowSignalWrites: true });
```

- For new code prefer `httpResource()` over `toSignal(http.get(...))` — `toSignal` + Observable interop is still useful when working with existing RxJS streams (e.g. `combineLatest`, `switchMap`, `FormControl.valueChanges`)
