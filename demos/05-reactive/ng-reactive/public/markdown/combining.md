# Combining Streams

Four combination operators, and the question each one answers.

## combineLatest

Emits whenever **any** source emits, pairing the latest value of every source. Nothing is emitted until every source has produced at least one value.

The demo combines three genuinely different sources: the search term, a checkbox, and the `GET /skills` response.

```typescript
combineLatest([
  toObservable(this.term).pipe(debounceTime(200)),
  toObservable(this.onlyOpen),
  this.skills$,
]).pipe(map(([term, onlyOpen, skills]) => ...));
```

Watch the emission counter. It is 1 after the HTTP response lands, and goes up by one on every keystroke that survives the debounce and on every checkbox change: the operator recomputes the whole result each time, from the latest value of all three.

That third source is the trap. `combineLatest` subscribes to it once, so this demo issues one request either way; `this.skills$` carries `shareReplay(1)` for the case that bites in real code, where the same `skills$` is also read somewhere else. A plain `http.get()` is cold, so every extra consumer issues its own request. `shareReplay(1)` makes the response a broadcast and replays it to whoever subscribes late.

## forkJoin

One emission, only when **every** source has completed. The RxJS equivalent of `Promise.all`.

```typescript
forkJoin({
  skills: this.http.get<Skill[]>(...),
  todos: this.http.get<Todo[]>(...),
  accounts: this.http.get<Account[]>(...),
})
```

The demo hits three real endpoints and logs each one as it completes, then logs the single `forkJoin` emission. The per-source lines land first and in a different order every run; the combined line lands after the slowest.

Use it for parallel one-shot loads. It never emits for a source that does not complete, which is why `forkJoin` over an `interval()` hangs forever, and why an HTTP call is the ideal input: it completes after one value.

## merge

Interleaves sources with no pairing. Values arrive in the order they are produced, and the result completes only when every source has.

Use it when several sources feed one handler: multiple event sources, several retry channels.

## withLatestFrom

Only the **trigger** emits. Every other source is read, never driving.

```typescript
this.saves.pipe(
  withLatestFrom(this.ticks$, toObservable(this.draft)),
  map(([, tick, draft]) => ...),
)
```

Type in the draft field and nothing is logged. Press Save and one line appears carrying both the draft and the ticker value. That is the difference from `combineLatest`, which would fire on every keystroke and every tick.

## Signals note

For derived state inside a component, `computed()` is `combineLatest` without the plumbing, and it never needs `shareReplay`. Reach for these operators when the sources are genuinely asynchronous events, or when you need `forkJoin`'s "wait for all to complete", which has no signal equivalent.
