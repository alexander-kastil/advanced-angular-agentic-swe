Transformation Operators are often used together with async requests. They are used to transform the data that is returned from the request. NgRx effects are a great place to use these operators.

![transformation](assets/images/transformation.png)

## When to Use Each

| Operator       | Use when...                                             | Cancels? | Parallel? |
| -------------- | ------------------------------------------------------- | -------- | --------- |
| `switchMap()`  | Only the latest result matters (search)                 | ✅ Yes   | ❌ No     |
| `mergeMap()`   | All results matter, order irrelevant (analytics events) | ❌ No    | ✅ Yes    |
| `concatMap()`  | Order must be preserved (sequential saves)              | ❌ No    | ❌ No     |
| `exhaustMap()` | Ignore new inputs while busy (login button)             | ❌ No    | ❌ No     |

## Real-World Examples

### switchMap() — search input

```typescript
searchTerm$.pipe(
  debounceTime(300),
  switchMap((term) => this.http.get(`/api/skills?q=${term}`)),
);
// Previous request is cancelled when user types again
```

### concatMap() — sequential saves

```typescript
saveClicks$.pipe(concatMap((data) => this.http.post("/api/save", data)));
// Queues saves — each waits for previous to complete
```

### exhaustMap() — prevent double submit

```typescript
submitClick$.pipe(exhaustMap(() => this.http.post("/api/order", this.form.value)));
// Ignores clicks while request is in flight
```

---

## 2026 Context

`switchMap()` is still heavily used in Angular with `httpResource()`. `exhaustMap()` is the go-to for form submits. `mergeMap()` appears in NgRx Effects.
