- `@angular/core/rxjs-interop` bridges RxJS and signals in both directions:
  - `toSignal(obs$, { initialValue })` — read an Observable as a **read-only** signal
  - `toObservable(sig)` — turn a signal into an Observable so RxJS operators can process it
  - `rxResource({ params, stream })` — an async resource whose loader returns an Observable

- `toSignal()` subscribes on creation and unsubscribes when the injection context is destroyed:

```typescript
readonly seconds = toSignal(interval(1000).pipe(startWith(0)), { initialValue: 0 });
```

- `toObservable()` goes the other way. It is the entry point for operators that have no signal
  equivalent, such as `debounceTime()`, `switchMap()` or `combineLatest()`:

```typescript
readonly onlyCompleted = signal(false);
readonly onlyCompleted$ = toObservable(this.onlyCompleted);
```

- `rxResource()` is the Observable-based sibling of `resource()`. `params` is the reactive
  input, `stream` maps it to an Observable. The resource re-runs whenever `params` changes and
  exposes `value()`, `isLoading()`, `error()` and `reload()`:

```typescript
readonly skills = rxResource({
  params: () => this.onlyCompleted(),
  stream: ({ params }) =>
    this.http.get<Skill[]>(url).pipe(map((list) => (params ? list.filter((s) => s.completed) : list))),
  defaultValue: [],
});
```

- Signals returned by `toSignal()` are read-only by design. Keep the writable state in a
  `signal()` and derive from it: never mirror a `toSignal()` result back into a writable signal.

- `allowSignalWrites` no longer exists. Writing a signal inside an `effect()` has been allowed
  since v19, so the option was removed. Code that still passes it is pre-v19.

- For plain HTTP reads prefer `httpResource()`. Reach for `rxResource()` when the loader needs
  RxJS operators, and for `toSignal()` when you consume a stream you do not own.

## Streaming resources

- `rxResource()` is one face of a more general mechanism. The core `resource()` takes **either** a
  `loader` that resolves once, **or** a `stream` that keeps pushing:

```typescript
readonly ticker = resource({
  params: () => this.channel(),
  stream: async ({ params, abortSignal }) => {
    const state = signal<ResourceStreamItem<string>>({ value: 'connecting' });
    const socket = new EventSource(`${environment.api}feed/${params}`);
    socket.onmessage = (e) => state.set({ value: e.data });
    socket.onerror = () => state.set({ error: new Error('feed dropped') });
    abortSignal.addEventListener('abort', () => socket.close());
    return state;
  },
  defaultValue: 'idle',
});
```

- The contract, from `ResourceStreamingLoader`: the loader returns a **`Signal<ResourceStreamItem<T>>`**
  (or a promise of one). Each item is either `{ value: T }` or `{ error: Error }`, so a stream can
  recover after a failure instead of terminating on it.

- `stream` and `loader` are mutually exclusive; the type makes `loader?: never` on the streaming
  overload, so passing both is a compile error rather than a runtime surprise.

- `abortSignal` on the loader params is how a stream gets torn down: the resource aborts it when
  `params` changes, when `reload()` is called, and when the injection context is destroyed. Close
  your socket there, not in `ngOnDestroy`.

- Status semantics differ from a one-shot loader. The resource moves to `resolved` on the **first**
  item and stays there while later items arrive, so `isLoading()` covers the connect phase only.
  `previous.status` in the loader params tells you whether this run is a fresh load or a reload.

- `rxResource({ stream })` is sugar over exactly this: it subscribes to your Observable and feeds
  each emission in as a `{ value }` item, each error as an `{ error }` item.
