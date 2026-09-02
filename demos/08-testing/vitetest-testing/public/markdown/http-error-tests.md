# HTTP Error Tests

Most HTTP specs assert the happy path and stop. The error path is where the interesting code lives: the interceptor, the message the user reads, the logging. All of it is testable with `provideHttpClientTesting()` and none of it needs a server.

## The interceptor under test

A functional interceptor, injected the v22 way, that turns a status code into a sentence and records it:

```typescript
export function errorMappingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const log = inject(ErrorLogService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = describeHttpError(error);
      log.record({ url: req.urlWithParams, status: error.status, message });
      return throwError(() => new Error(message));
    })
  );
}
```

## Wiring the test bed

The interceptor is part of the thing under test, so it goes into `provideHttpClient`. `provideHttpClientTesting()` comes after it and replaces only the backend.

```typescript
TestBed.configureTestingModule({
  providers: [
    provideHttpClient(withInterceptors([errorMappingInterceptor])),
    provideHttpClientTesting(),
  ],
});
```

Order matters: `provideHttpClientTesting()` must come after `provideHttpClient()` or the real backend wins.

## Flushing a failure

`flush()` takes a body and an init object. Anything with a non-2xx status arrives at the subscriber's `error` callback.

```typescript
it('maps a 404 to a sentence a user can read', () => {
  const onError = vi.fn();
  api.loadOne(9999).subscribe({ error: onError });

  controller.expectOne(`${url}/9999`).flush('Not Found', { status: 404, statusText: 'Not Found' });

  expect(onError).toHaveBeenCalledOnce();
  expect(onError.mock.calls[0][0].message).toBe('That record no longer exists');
});
```

A `vi.fn()` as the error callback is better than a `try/catch` or an inline assertion: `toHaveBeenCalledOnce()` also proves the observable did not error twice or complete silently.

## Transport failures are not status codes

A DNS failure, a CORS rejection or a dropped connection never produces an HTTP status. Simulate it with `error()` and a `ProgressEvent`, and Angular reports `status: 0`:

```typescript
controller.expectOne(url).error(new ProgressEvent('network error'));

expect(onError.mock.calls[0][0].message).toBe('The server could not be reached');
expect(errors.log()[0].status).toBe(0);
```

Status `0` is the branch teams forget, and it is the one users hit on a train.

## Assert what the interceptor changed

Two assertions carry the real contract of this interceptor:

```typescript
it('records the failing url and status in the log', () => {
  api.loadOne(7).subscribe({ error: () => undefined });

  controller.expectOne(`${url}/7`).flush('Not Found', { status: 404, statusText: 'Not Found' });

  expect(errors.log()).toEqual([
    { url: `${url}/7`, status: 404, message: 'That record no longer exists' },
  ]);
});

it('replaces the HttpErrorResponse with a plain Error for the caller', () => {
  const received = onError.mock.calls[0][0];
  expect(received).toBeInstanceOf(Error);
  expect(received.status).toBeUndefined();
});
```

The second one is a boundary test: components downstream should never see an `HttpErrorResponse`. If someone deletes the mapping and passes the original error through, this fails and nothing else does.

Also assert the negative: a successful response must leave the log empty. An interceptor that logs on success is a real bug and no error-path test can see it.

## verify() in afterEach

```typescript
afterEach(() => {
  controller.verify();
});
```

`verify()` fails the spec if a request was made and never flushed. On error-path suites this catches the retry you forgot about.

## Through the component

The same controller drives the component, so you can assert the message that actually reaches the screen:

```typescript
fixture.nativeElement.querySelector('[data-testid="load"]').click();
controller.expectOne(url).flush('Boom', { status: 500, statusText: 'Server Error' });
fixture.detectChanges();

expect(fixture.nativeElement.querySelector('[data-testid="outcome"]').textContent)
  .toContain('The server failed, please retry');
```
