# rxResource vs switchMap

Both panes do the same job: filter a list from the API as the user types, cancelling the request that is already in flight. The request counter under each one lets you confirm they behave identically.

## The switchMap version

```typescript
protected classicResult = toSignal(
  this.classicTerm.valueChanges.pipe(
    startWith(''),
    debounceTime(400),
    distinctUntilChanged(),
    switchMap((term) =>
      defer(() => {
        this.classicRequests.update((count) => count + 1);
        this.classicLoading.set(true);
        this.classicFailed.set(false);
        return this.http.get<Skill[]>(this.url);
      }).pipe(
        map((skills) => skills.filter(...)),
        catchError(() => { this.classicFailed.set(true); return of([] as Skill[]); }),
        finalize(() => this.classicLoading.set(false)),
      ),
    ),
  ),
  { initialValue: [] as Skill[] },
);
```

Count what is load-bearing here and not about filtering:

- `startWith('')` so the list is not empty before the first keystroke.
- `distinctUntilChanged()` so a keystroke that restores the previous value does not refetch.
- `catchError` so one failed request does not kill the stream. Without it the search box stops working permanently, with no visible error.
- `defer` + `finalize` + two extra signals, purely to have a loading flag and an error flag.

## The rxResource version

```typescript
protected skillsResource = rxResource({
  params: () => this.resourceTerm(),
  stream: ({ params }) => this.http.get<Skill[]>(this.url).pipe(map(...)),
  defaultValue: [],
});
```

`params` is the trigger. Changing it cancels the previous stream and starts a new one, so `switchMap` semantics are the default rather than a choice. `status()`, `isLoading()`, `error()`, `hasValue()` and `reload()` come with it, and an error does not terminate anything: the next params change starts a fresh request.

What it does **not** do is debounce. The resource fires on every params change, which is why its request counter runs ahead of the classic one when you type fast. Pair it with `debounced()` from `@angular/core`, shown in the `debounce-three-ways` demo, and you have the whole pipeline back with none of the plumbing. The `interop` demo settles its `params` the older way, with `toObservable()` plus `debounceTime()`.

## chain(): dependent requests

```typescript
protected firstSkillDetail = rxResource({
  params: ({ chain }) => chain(this.skillsResource).at(0)?.id,
  stream: ({ params }) => this.http.get<Skill>(`${this.url}/${params}`),
});
```

`chain()` is a property of the params context, not a standalone import. It reads another resource's value and propagates its status by throwing the appropriate status code when the value is not there: while the list is loading, the detail resource reports loading too; if the list errors, so does the detail. The switchMap equivalent is a nested pipeline where the loading state of the inner request has to be merged with the outer one by hand.

## When the pipeline still wins

When the trigger is not a signal: a websocket, a stream of DOM events, retry with backoff over a long-lived connection. And when you need a flattening strategy that is not `switchMap` (see the `flattening-strategies` demo). `rxResource` covers request and response. It is not a replacement for RxJS, it is a replacement for the request/response boilerplate people write with RxJS.
