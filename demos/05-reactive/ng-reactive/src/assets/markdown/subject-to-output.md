## Subject vs output() Signals

Both patterns send data from a child to a parent, but with different semantics.

## Subject (RxJS)

```typescript
// Child
clicked$ = new Subject<string>();
emit() { this.clicked$.next('data'); }

// Parent template
<app-child #child />
// Parent TS
ngAfterViewInit() {
  this.child.clicked$.subscribe(msg => ...);
  // Must unsubscribe or use takeUntilDestroyed
}
```

**Problems:**

- Parent must subscribe manually
- Requires cleanup (memory leak risk)
- Not part of Angular's component contract
- Not visible in template as event binding

## output() Signal

```typescript
// Child
clicked = output<string>();
emit() { this.clicked.emit('data'); }

// Parent template
<app-child (clicked)="onClicked($event)" />
```

**Benefits:**

- ✅ Standard Angular event binding
- ✅ No manual subscribe/unsubscribe
- ✅ Type-safe
- ✅ Works with `outputToObservable()` for RxJS interop

## When to Use Subject

Subjects are still useful for:

- Internal service event buses
- Multicasting to multiple subscribers
- RxJS operator pipelines on events

---

## 2026 Context

For component outputs, always use `output<T>()`. Use `Subject` only for internal reactive pipelines inside services.
