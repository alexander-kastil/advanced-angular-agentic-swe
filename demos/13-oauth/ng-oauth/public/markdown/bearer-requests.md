# Bearer Tokens on HttpClient

Whatever identity provider you use, the API sees one thing: an `Authorization: Bearer <token>`
header. This demo sends it by hand so the next demo has something to replace.

## An echo API without a server

The route registers its own `HttpClient` with an interceptor that never calls `next()`. It answers
every request to `https://api.ng-oauth.demo/` itself: 401 with `WWW-Authenticate: Bearer` when the
header is missing, 200 with the request headers echoed back when it is present.

```typescript
{
  path: 'bearer-requests',
  providers: [provideHttpClient(withInterceptors([echoBackendInterceptor]))],
  loadComponent: () => import('./samples/bearer-requests/bearer-requests.component')
}
```

Route-level `provideHttpClient()` creates a separate `HttpClient` for that route's injector. The
app-wide interceptors do not run for it unless you add `withRequestsMadeViaParent()`.

## Read the whole response

By default `HttpClient` returns the body. `observe: 'response'` returns an `HttpResponse<T>` with
`status`, `headers` and `body`, which you need when an API returns a `Location` or a paging header:

```typescript
const response = await firstValueFrom(
  this.http.get<Order[]>(url, { observe: 'response' })
);
response.status;
response.headers.get('X-Total-Count');
```

## Send the header by hand

```typescript
const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
this.http.get<Order[]>(url, { headers });
```

## Run the demo

1. Open **Bearer Tokens on HttpClient** and click **GET body only**. The call fails with 401.
2. Click **GET observe: response**. Same 401, now with the `WWW-Authenticate` response header.
3. Click **GET with Authorization**. The status is 200 and the echo shows the header the server
   received.

Expected result: the echo body lists `Authorization: Bearer eyJhbGciOiJub25lIn0...`.

## Why this does not scale

Every service method now has to remember the header, and nothing stops one from sending it to the
wrong host. Copy the call to a CDN or analytics URL and your token travels with it. The interceptor
in the next demo owns both decisions: whether to attach and where.
