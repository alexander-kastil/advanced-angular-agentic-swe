# Hybrid rendering: choosing a render mode per route

`ng add @angular/ssr` writes a route table that prerenders everything. That is almost never the
right table, and the wrong entries fail in ways a build does not catch. Decide per route by asking
what the page needs that only a browser has.

## The decision

| The route needs | Mode | Why |
| --- | --- | --- |
| Nothing per-user | `RenderMode.Prerender` | Same bytes for everyone, served as a static file |
| Per-request data the server can fetch itself | `RenderMode.Server` | The server has to be able to obtain it without a browser-held credential |
| A token, `localStorage`, or a value that must never be in HTML | `RenderMode.Client` | The server cannot get it, or must not hold it |

An auth guard reading a token from `localStorage` puts every route behind it in the third row.
Under `RenderMode.Server` such a route does not render slowly, it renders wrong: the guard finds no
session on the server and answers with a redirect, so the response is `302 Found` with
`location: /login?next=...`. Nothing errors and the build is clean.

A page whose content is a credential belongs in the third row for a second reason that has nothing
to do with feasibility: server-rendered HTML holding a secret is a secret in every proxy cache
between the server and the reader.

## Four things that break on the first SSR build

**`localStorage` is not defined.** Anything an `provideAppInitializer` touches runs on the server
too. Guard it once at the source rather than at every call site:

```ts
private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

restore(): void {
  if (!this.isBrowser) return;
  // ...
}
```

**A relative API URL resolves against nothing.** In the browser the dev-server proxy or the reverse
proxy makes `/api/...` work. The server process is not a browser and has no proxy, so it needs the
API's reachable address. An injection token keeps that fact in one file:

```ts
export const API_BASE = new InjectionToken<string>('API_BASE', {
  providedIn: 'root',
  factory: () =>
    isPlatformBrowser(inject(PLATFORM_ID)) ? '' : (process.env['API_ORIGIN'] ?? 'http://localhost:5093'),
});
```

**`httpResource` does not block a server render.** The renderer finishes the HTML while the request
is still in flight, so the page ships with its pending state and the transfer cache carries
nothing. A `ResolveFn` returning a promise is what the router awaits; move the fetch there and feed
the value in through `withComponentInputBinding()`.

**`allowedHosts` needs the `host:port` form too.** Configured in `angular.json` under the build
options:

```json
"security": { "allowedHosts": ["localhost", "localhost:4000", "app.example.org"] }
```

A host listed bare still answers `400` to a request whose `Host` header carries a port:
`Header "host" with value "localhost:4000" is not allowed`.

## Behind a reverse proxy

`trustProxyHeaders` is **not** a key in `angular.json`'s `security` block. Putting it there fails the
build with `Data path "/security" must NOT have additional properties(trustProxyHeaders)`. It is a
constructor option on the engine in `src/server.ts`:

```ts
const angularApp = new AngularNodeAppEngine({ trustProxyHeaders: true });
```

Without it, a request arriving through Caddy or nginx logs
`Received "x-forwarded-proto" header but "trustProxyHeaders" was not set up to allow it.`

## Transfer cache

```ts
provideClientHydration(
  withIncrementalHydration(),
  withHttpTransferCacheOptions({ includeRequestsWithAuthHeaders: false }),
)
```

The flag defaults to false and should stay false: transferring an authorized response embeds a
per-user payload in HTML that may be cached. If every data route in the app is client-rendered,
the transfer cache has nothing to carry, and saying so is a better answer than inventing a
server-rendered route to justify it.

## Verify by reading the wire, not the config

The render mode is a claim about what the server sends, so `curl` settles it. Each mode identifies
itself in the HTML:

```text
/login          ng-server-context="ssg"   the form is in the HTML
/status         ng-server-context="ssr"   the data is in the HTML, plus an ng-state script
/secrets/a/b    no server context         <app-root></app-root>, empty
```

For a route that must not leak, grep the body for the words that would prove a leak and assert the
count is zero. A page that never reaches a server cannot be cached by one.
