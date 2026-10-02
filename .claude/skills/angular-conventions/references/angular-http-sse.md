# Server-Sent Events through HttpClient

## When to use

An endpoint answers `text/event-stream` (a cached value now and a fresh one later, progress of a
long job, a live feed) and the app authenticates with a bearer-token interceptor such as MSAL.

## Why not `EventSource`

The browser's `EventSource` cannot set request headers, so the `Authorization` header never goes
out and the MSAL interceptor never runs. Putting the token in the query string instead leaks it
into proxy and server logs. Read the stream through `HttpClient`: the interceptor chain, the base
URL handling and `HttpTestingController` all keep working.

## The shape

`responseType: 'text'`, `observe: 'events'`, `reportProgress: true`. Every
`HttpDownloadProgressEvent` carries the whole body so far in `partialText`; parse only the new tail,
keep an incomplete trailing frame for the next chunk, and complete on `HttpEventType.Response`.

```ts
import { HttpClient, HttpDownloadProgressEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SseEvent<T> { event: string; data: T; }

export function parseSseFrames(buffer: string): { frames: { event: string; data: string }[]; rest: string } {
  const parts = buffer.replace(/\r\n/g, '\n').split('\n\n');
  const rest = parts.pop() ?? '';
  const frames = parts.filter(p => p.trim()).map(block => {
    let event = 'message';
    const data: string[] = [];
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      else if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''));
    }
    return { event, data: data.join('\n') };
  });
  return { frames, rest };
}

export function sseStream<T>(http: HttpClient, url: string): Observable<SseEvent<T>> {
  return new Observable<SseEvent<T>>(subscriber => {
    let seen = 0;
    let buffer = '';
    const take = (text: string) => {
      buffer += text.slice(seen);
      seen = text.length;
      const { frames, rest } = parseSseFrames(buffer);
      buffer = rest;
      for (const f of frames) subscriber.next({ event: f.event, data: JSON.parse(f.data) as T });
    };
    const sub = http.get(url, { observe: 'events', responseType: 'text', reportProgress: true }).subscribe({
      next: e => {
        if (e.type === HttpEventType.DownloadProgress) take((e as HttpDownloadProgressEvent).partialText ?? '');
        else if (e.type === HttpEventType.Response) { take((e.body ?? '') + '\n\n'); subscriber.complete(); }
      },
      error: err => subscriber.error(err),
    });
    return () => sub.unsubscribe();
  });
}
```

## Feeding a store or a signal

- **NgRx Signal Store:** `merge()` one `sseStream` per feed inside the `rxMethod`, `patchState` on
  every data event, and leave state untouched on an error event such as `unavailable`. The view
  renders the first event immediately and re-renders in place on the next one.
- **Component-local:** Angular's `resource({ stream })` takes a loader that returns a signal; set
  that signal from the subscription above. `loader` resolves once and cannot represent the second
  value.

## Server side and deployment

- The .NET 10 producer is `TypedResults.ServerSentEvents(IAsyncEnumerable<SseItem<T>>)`. It
  serializes with the HTTP JSON options, not MVC's, so it can ship different key casing from the
  controller beside it: `dotnet-conventions` `references/json-casing-contract.md`.
- A buffering reverse proxy delivers every event at the end of the response, which looks exactly
  like a client that parses only on completion. nginx needs `proxy_buffering off` (or the server
  sends `X-Accel-Buffering: no`); Caddy flushes `text/event-stream` on its own.
- `partialText` holds the whole body so far, so this helper suits streams that end. A stream that
  never ends grows client memory without limit: have the server close it on a timer and reconnect
  from the last event id. Full pattern for a long-lived change feed: `multi-client-sync`.

## Testing

```ts
const req = httpTesting.expectOne(url);
req.event({ type: HttpEventType.DownloadProgress, loaded: 1, partialText: 'event: cached\ndata: {"a":1}\n\nevent: upd' });
req.event({ type: HttpEventType.DownloadProgress, loaded: 2, partialText: 'event: cached\ndata: {"a":1}\n\nevent: updated\ndata: {"a":2}\n\n' });
req.flush('event: cached\ndata: {"a":1}\n\nevent: updated\ndata: {"a":2}\n\n');
```

Assert two events in order and exactly one completion; the first chunk deliberately ends inside a
frame, which is the case a naive `split('\n\n')` without a remainder gets wrong.

## Verify it still holds

- In the browser's network panel the request is a plain GET with the `Authorization` header
  present and `content-type: text/event-stream` on the response.
- A spec that splits one frame across two progress events passes.
- On a cached-then-fresh endpoint the first value paints before the request completes: read the DOM
  twice, the second read after the response ends.
