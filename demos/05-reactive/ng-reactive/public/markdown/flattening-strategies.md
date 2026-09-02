# Flattening Strategies

A higher order mapping operator subscribes to an inner Observable for every outer emission. The four operators differ only in what they do when a new outer value arrives while an inner Observable is still running.

| Operator | Pending inner Observable | Use it for |
| --- | --- | --- |
| `switchMap` | cancelled | type-ahead search, route params, anything where only the latest matters |
| `mergeMap` | kept, runs in parallel | independent writes, uploads, telemetry |
| `concatMap` | queued, runs after | ordered writes where sequence matters |
| `exhaustMap` | new value ignored | submit buttons, login, anything that must not double fire |

## The demo

Every click pushes the same id into all four pipelines. Each pipeline issues a real `GET /skills` against json-server, held for 1500 ms by a `delay()` so you can overlap them by hand. Click four times fast and read the three counters before the log:

| Counter | switchMap | mergeMap | concatMap | exhaustMap |
| --- | --- | --- | --- | --- |
| subscribed | 4 | 4 | 4 | 1 |
| in flight, at the peak | 1 | 4 | 1 | 1 |
| delivered | 1 | 4 | 4 | 1 |

`subscribed` is the reveal. `exhaustMap` never subscribes to the ignored clicks at all, so no request leaves the browser. `switchMap` subscribes four times and tears three of them down, and `delivered` stays at 1 because only the newest inner Observable survives to emit.

One honest caveat about this demo: json-server answers in a few milliseconds, and the 1500 ms `delay()` sits **after** the request, so what `switchMap` tears down here is almost always the delay rather than an open connection. Do not expect `(canceled)` rows in the network tab against a local API. Against a genuinely slow endpoint the same teardown does abort the HTTP request, which is the behaviour the counters are standing in for.

The elapsed time is measured from the click, not from the subscription, which is what makes `concatMap` legible: 1500, 2800, 4100, 5400 ms. The queue is the whole behaviour.

```typescript
private slowRequest(strategy: Strategy, { id, firedAt }: Fire) {
  let delivered = false;

  return defer(() => {
    this.patch(strategy, (pane) => ({
      ...pane,
      subscribed: pane.subscribed + 1,
      inFlight: pane.inFlight + 1,
    }));
    return this.http.get<Skill[]>(this.url);
  }).pipe(
    delay(this.latency),
    map((skills) => `#${id} resolved ${skills.length} skills ${this.elapsed(firedAt)} after the click`),
    finalize(() => {
      this.patch(strategy, (pane) => ({ ...pane, inFlight: pane.inFlight - 1 }));
      if (!delivered) {
        this.append(strategy, `#${id} cancelled ${this.elapsed(firedAt)} after the click`);
      }
    }),
  );
}
```

`defer` is what makes the counter honest: the body runs on every subscription, not once when the Observable is created. `finalize` runs on completion **and** on unsubscribe, which is how a cancellation gets logged at all.

## The mistake to avoid

`mergeMap` is the default people reach for because it never drops anything. On a search box it produces out-of-order results: request 2 can resolve after request 4, and the user sees stale data with no error anywhere. The demo shows exactly that whenever the mergeMap column ends on a number that is not the last one you clicked.

## The signals version

`rxResource` has `switchMap` semantics built in: changing `params` cancels the request in flight. See the `rxresource-vs-switchmap` demo. When you need one of the other three, you are still writing the pipeline by hand, and that is correct.
