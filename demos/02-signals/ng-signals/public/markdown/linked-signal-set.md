- `linkedSignal()` is writable derived state: it recomputes from a source, but you can also write to
  it. The `set` option lets you **intercept every write** before it lands.

```typescript
readonly stock = signal(10);

readonly quantity = linkedSignal<number, number>({
  source: () => this.stock(),
  computation: (stock, previous) => Math.min(previous?.value ?? 1, stock),
  set: (value, rawSet) => {
    const stock = untracked(this.stock);
    const clamped = Math.min(Math.max(value, 1), stock);
    this.lastWrite.set(`asked for ${value}, stored ${clamped}`);
    rawSet(clamped);
  },
});
```

- The signature is `set(value, rawSet)`:
  - `value` is what the caller passed to `.set()`, or the result of the updater passed to `.update()`
  - `rawSet(next)` performs the actual write; **if you never call it, the write is dropped**

- Both `.set()` and `.update()` route through your `set`. For `.update()`, Angular reads the current
  value untracked, applies your updater, and hands the result to `set` as `value`.

- What this buys you, without a wrapper method and without a second signal:
  - **clamping and validation** at the state boundary, so no caller can store an invalid quantity
  - **auditing**, as in the demo's `lastWrite` line
  - **rejecting** a write outright by returning without calling `rawSet`
  - **normalising** input (trimming a string, rounding a number) in one place

- Read other signals inside `set` with `untracked()`. `set` runs during a write, not inside a
  reactive computation, so a tracked read there would be misleading rather than useful.

- The `computation` still owns the reset path. Press **Restock** or **Sell out** and the source
  changes, so `computation(stock, previous)` runs and re-derives the quantity, discarding any manual
  override that no longer fits. That is the division of labour:

| Piece | Runs when | Owns |
| --- | --- | --- |
| `source` | any dependency changes | what the derived state is derived *from* |
| `computation` | source changed | how to re-derive, given the previous value |
| `set` | someone writes | whether and how a write is allowed |

- `set` is available on **both** `linkedSignal` overloads: the short
  `linkedSignal(() => ..., { set })` form and the `{ source, computation, set }` form used here.
