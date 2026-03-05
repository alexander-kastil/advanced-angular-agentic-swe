## Timer & Interval Operators

These operators create time-based Observable streams.

## interval(period)

Emits an incrementing number every `period` milliseconds. Never completes — always pair with `take()` or `takeUntilDestroyed()`.

```typescript
import { interval } from "rxjs";
import { take, takeUntilDestroyed } from "rxjs/operators";

interval(1000)
  .pipe(take(10), takeUntilDestroyed(this.destroyRef))
  .subscribe((n) => console.log(n)); // 0, 1, 2 ... 9
```

**Use cases:** Polling, countdowns, progress indicators.

## timer(delay, period?)

Fires once after `delay` ms. With a second argument, becomes a delayed `interval()`.

```typescript
import { timer } from "rxjs";

timer(2000).subscribe(() => console.log("fired once after 2s"));

timer(1000, 500)
  .pipe(take(5))
  .subscribe((n) => console.log(n)); // starts after 1s, emits every 500ms
```

**Use cases:** Auto-dismiss notifications, delayed init, polling with initial delay.

## delay(ms)

Postpones all emissions by `ms` milliseconds without changing values.

```typescript
import { of } from "rxjs";
import { delay } from "rxjs/operators";

of(1, 2, 3).pipe(delay(1000)).subscribe(console.log);
// Each value emits 1 second after the source emits
```

**Use cases:** Simulating async latency in tests, animations, debounced UI feedback.

---

## 2026 Context

`interval()` and `timer()` remain common in Angular for polling patterns. For loading states prefer `httpResource()` — but `timer()` is still used in toast/snackbar auto-dismiss logic.
