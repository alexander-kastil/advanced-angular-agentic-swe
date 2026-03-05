- Effects can set up resources (timers, listeners, subscriptions) that must be cleaned up when the effect destroys:

```typescript
effect(() => {
  const interval = setInterval(() => {
    console.log("tick");
  }, 1000);

  // Cleanup function
  return () => clearInterval(interval);
});
```

- The cleanup function runs **before the effect is destroyed** or **when the effect re-runs**

- Common cleanup scenarios:
  - `clearInterval()` / `clearTimeout()` for timers
  - `removeEventListener()` for DOM listeners
  - `.unsubscribe()` for RxJS subscriptions
  - `AbortController.abort()` for fetch requests

- Manual effect destruction:

```typescript
const eff = effect(() => { ... });
eff.destroy(); // Stop the effect + run cleanup
```

- **Without cleanup:** Memory leaks — timers keep running, listeners remain attached, subscriptions stay active

- **Takeaway:** Always return cleanup functions from effects that manage resources
