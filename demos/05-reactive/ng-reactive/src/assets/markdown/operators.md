- Get to know the basic operators in RxJS

## Common Operators

| Operator     | Purpose                                      |
| ------------ | -------------------------------------------- |
| `map()`      | Transform each emission                      |
| `filter()`   | Drop emissions that fail a predicate         |
| `tap()`      | Side-effects without changing the stream     |
| `take(n)`    | Complete after n emissions                   |
| `reduce()`   | Accumulate all values into one (on complete) |
| `find()`     | Emit first match then complete               |
| `mergeMap()` | Flatten inner Observables, no cancellation   |

## Real-World Examples

### map() — shape API responses

```typescript
vouchers$.pipe(map((vs) => vs.map((v) => ({ ...v, label: `${v.Text} — €${v.Amount}` }))));
```

### filter() + tap() — conditional logging

```typescript
orders$.pipe(
  filter((o) => o.amount > 100),
  tap((o) => console.log("High-value order", o)),
);
```

### mergeMap() — execute parallel HTTP calls

```typescript
orderIds$.pipe(mergeMap((id) => this.http.get(`/api/orders/${id}`)));
```

---

## 2026 Context

RxJS operators remain the foundation for Angular library interop. For application state prefer signals (Module 03). Use `toSignal()` to bridge Observables into components.
