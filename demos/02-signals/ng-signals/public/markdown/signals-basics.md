- Examine `signals-basics.component.ts` and its use of `signal()`, `computed()` and `effect()`

- `signal()` creates a reactive value — read it by calling it like a function, write with `.set()` or `.update()`:

```typescript
netAmount = signal<number>(0);
netAmount.set(100);
netAmount.update(curr => curr + 10);
```

- `computed()` creates a **read-only** derived signal — recalculates only when its dependencies change:

```typescript
tax = signal(0.2).asReadonly();
grossAmount = computed(() => this.netAmount() * (1 + this.tax()));
```

- `effect()` runs a side effect whenever its signal dependencies change — can be declared as a field or inside the constructor. Use `Injector` to create effects outside the injection context:

```typescript
logChanges = effect(() => {
  console.log('amount changed', this.netAmount());
});
```

- Use `signal.asReadonly()` to expose internal state without allowing external writes
