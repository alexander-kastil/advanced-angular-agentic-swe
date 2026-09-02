# Error Handling

An error terminates an Observable. There is no resuming it: the only options are to replace it, to resubscribe, or to let it reach the subscriber.

Every pane in this demo runs against a real 404. `GET /skilz` is a route json-server does not have, so `HttpClient` produces an actual `HttpErrorResponse` with `status: 404` rather than a thrown string.

## catchError

What you **return** from `catchError` is the whole decision, and the three buttons show the three answers.

```typescript
catchError((err: HttpErrorResponse) => {
  this.push(this.catchLog, `catchError saw HTTP ${err.status}`);
  if (recovery === 'empty') return EMPTY;
  if (recovery === 'fallback') return of('0 skills (cached fallback)');
  return throwError(() => err);
})
```

| Return | The subscriber sees |
| --- | --- |
| `EMPTY` | no `next`, then `complete`. The error handler never runs. |
| `of(fallback)` | one `next` with the fallback, then `complete`. |
| `throwError(() => err)` | no `next`, then `error`. Logging happened, recovery did not. |

`finalize` runs in all three cases, which is why it is the right place for a loading flag and the wrong place for success logic.

Position matters. An operator placed **after** `catchError` never sees the error; one placed before it does.

## retry

```typescript
defer(() => {
  this.attempt += 1;
  const url = this.attempt < 3 ? this.badUrl : this.goodUrl;
  return this.http.get<Skill[]>(url);
}).pipe(retry({ count: 5, delay: 600 }))
```

`retry` resubscribes to the source, which means the source runs **again from the top**. `defer` is what makes that visible: its body re-executes on every resubscription, so the third attempt can pick the working URL and the log reads `attempt 1`, `attempt 2`, `attempt 3`, `succeeded`.

Resubscription is correct for an HTTP GET and wrong for a POST that already reached the server. The `delay` option takes a number or a function returning an Observable, which is how you build exponential backoff.

## A custom operator

An operator is a function from Observable to Observable. Anything you can express with `pipe()` you can package:

```typescript
export function catchWithFallback<T>(
  fallback: T,
  onError: (message: string) => void,
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    source.pipe(
      tap({ error: (err: Error) => onError(err.message) }),
      catchError(() => of(fallback)),
    );
}
```

`tap({ error })` observes without consuming, so `catchError` still gets the error. Swapping the two lines would break it.

Because it is a plain function over streams, it is testable without a component. `catch-with-fallback.spec.ts` verifies it with the `TestScheduler`:

```typescript
scheduler().run(({ cold, expectObservable }) => {
  const source$ = cold('a-#', { a: 1 }, new Error('boom'));
  const result$ = source$.pipe(catchWithFallback(-1, (m) => messages.push(m)));
  expectObservable(result$).toBe('a-(f|)', { a: 1, f: -1 });
});
```

Marble syntax: `-` is one frame, `#` is an error, `|` is completion, and `(f|)` means the value and the completion land in the same frame.

Run it with `npm test`.

## The resource equivalent

`httpResource` and `rxResource` never terminate on an error. The failure lands in `error()` and the next `params` change starts a fresh request, which is `catchError` plus a retry trigger that you did not have to write. You still need this material for anything that is not request and response.
