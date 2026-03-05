- There are situations where you may want to create an Observable from scratch or convert an existing data source into an Observable.
- For example, you may have a function that returns a value and you want to make it reactive, or you may have an array that you want to process as a stream of events.
- In these cases, you can use various operators and methods to create or cast Observables.
- Open console in F12 Dev Tools to see output

## Examples

### Using `of()`

```typescript
of(1, 2, 3).subscribe((value) => console.log(value));
// Output: 1, 2, 3
```

### Using `from()`

```typescript
from([10, 20, 30]).subscribe((value) => console.log(value));
// Output: 10, 20, 30
```

### Using `interval()`

```typescript
interval(1000).subscribe((count) => console.log(count));
// Output: 0, 1, 2, ... (every 1 second)
```

---

## 2026 Context

RxJS remains important for library integration and reactive patterns. Use Signals for application state (Module 03), HttpResource for HTTP requests, and SignalStore for complex state (Module 05).
