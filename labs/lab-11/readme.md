# Choose a Render Mode per Route

Server rendering is usually presented as a switch: on, and the app is faster. In a credential
manager it is a decision per route, and one of those routes has an answer that is not negotiable.
In this lab you add SSR, work out which of the workbench's routes can be rendered on a server at
all, and prove the answer by reading the HTML that comes off the wire.

------

Work in [`l11-secrets-vault-starter/`](./l11-secrets-vault-starter/). Run `claude` from the
repository root and `npm` commands in the app folder. The finished result is in
[`l11-secrets-vault-solution/`](./l11-secrets-vault-solution/).

```bash
cd labs/lab-11/l11-secrets-vault-starter
npm install
npm start
```

---

## Step 1: Add SSR and watch it break on a browser API

Overview: `ng add @angular/ssr` writes a server entry point, a server config and a route table
that prerenders everything. The first build fails, and the failure names a real design problem
rather than a setup mistake.

Recipe:

```text
Run npx ng add @angular/ssr --skip-confirmation --defaults in the app folder, then run
npm run build and report the error verbatim.

Fix it in auth-store.ts: inject PLATFORM_ID, derive an isBrowser flag with isPlatformBrowser, and
guard every localStorage access behind it, in restore, signIn and signOut. Comment the flag with
why it exists. Then add withFetch() to provideHttpClient, because the server has no XHR.
```

Expected Outcome: the failing build names the API that does not exist on a server, and the guarded
build prerenders:

```text
before  ERROR ReferenceError: localStorage is not defined at e.restore (...)
after   Prerendered 1 static route.
```

---

## Step 2: Work out what may be rendered on a server

Overview: the generated route table prerenders every route, which for this app means writing
authenticated screens to static files. The right table falls out of one question asked per route:
what does this page need that only a browser has?

Research:

```text
The app has these routes: /login, /status (a public page showing whether the vault API answers),
/secrets, /secrets/:listId and /secrets/:listId/:secretId. The auth guard reads a token from
localStorage, and the detail route renders a secret's fields.

For each route, decide between RenderMode.Prerender, RenderMode.Server and RenderMode.Client.
For each answer say what the server would put into the HTML, who could read it, and what happens
to the auth guard when it runs on a server that has no localStorage. Then tell me what the server
actually returns today for /secrets under RenderMode.Server.
```

Finding: the answer must reach three conclusions. `/login` is the same for everyone and belongs in
`Prerender`. Anything behind the auth guard cannot be server rendered at all, because the guard
finds no session on the server and answers with a redirect: request `/secrets` under
`RenderMode.Server` and the server returns `302 Found` with
`location: /login?next=%2Fsecrets`, which is not a faster page but a broken one. And the secret
detail is the one route where the decision is not about speed: server-rendered HTML holding a
credential is a credential in a proxy cache.

Recipe:

```text
Rewrite src/app/app.routes.server.ts: prerender /login, server-render /status, and set
RenderMode.Client for /secrets, /secrets/:listId, /secrets/:listId/:secretId and the wildcard.
Put one comment above each group saying why, in one line.

Add the security block the SSR server needs in angular.json under the build options:
"security": { "allowedHosts": ["localhost", "localhost:4000", "127.0.0.1"] }. Without the port
form the server answers 400 with "Header host with value localhost:4000 is not allowed".
```

Expected Outcome: `npm run build` prerenders one route, and the built output shows which is which:

```text
dist/l11-secrets-vault/browser/login/index.html   the prerendered login screen
dist/l11-secrets-vault/browser/index.csr.html     the shell for every client route
```

---

## Step 3: Build the one route worth server-rendering

Overview: every data route in this app needs a token, so none of them can be server rendered. The
one page that can is the one nobody has to sign in for, and building it is what makes the transfer
cache demonstrable at all.

Recipe:

```text
Create src/app/shared/api-base.ts exporting an API_BASE injection token whose factory returns an
empty string in the browser and http://localhost:5093 on the server, commented with why: the
browser reaches the API through the dev-server proxy on a relative path and the server has no
proxy.

Create src/app/pages/status-page.ts, a component with a required health input rendering it under
a Vault status heading, with an accent color when it reads Healthy and a link to /login.

Add a /health entry to proxy.conf.json beside /api, because the health endpoint sits at the API
root rather than under /api.

Register the route at /status in app.routes.ts.
```

Expected Outcome: the page renders in the browser and reads the health through the proxy. The
server-rendered version is still wrong at this point, which is step 4.

---

## Step 4: Resolve the data the server has to wait for

Overview: `httpResource` does not block a server render. The server finishes the HTML while the
request is still in flight, so the page ships with its pending state and the transfer cache carries
nothing. A resolver returns a promise the router awaits, which is what SSR needs.

Recipe:

```text
Create src/app/pages/health.resolver.ts: a ResolveFn that GETs the health as text through
API_BASE, mapping any failure to the string unreachable with catchError, and awaited through
firstValueFrom.

Put it on the /status route as resolve: { health: healthResolver }, and let
withComponentInputBinding feed it into the component's health input. Remove the httpResource from
the component.

Then enable the cache in app.config.ts: provideClientHydration with withIncrementalHydration() and
withHttpTransferCacheOptions({ includeRequestsWithAuthHeaders: false }), commented with why an
authorized response must never be transferred.
```

Expected Outcome: run the built server with
`PORT=4000 node dist/l11-secrets-vault/server/server.mjs` and the status arrives already rendered:

```text
before  <p class="state">unknown</p>
after   <p class="state up">Healthy</p>
```

---

## Step 5: Read the three modes off the wire

Overview: the render mode is a claim about what the server sends, so the only honest check is the
response body. Three `curl` calls settle all three routes, and the third is the one that matters.

Recipe:

```text
With the built server running on port 4000, fetch each of the three routes and report, for each,
the value of the ng-server-context attribute and whether the app-root element carries any rendered
content.

Then answer the question this lab exists for: grep the client route's HTML for the words hetzner,
password and comment, and report the count.
```

Expected Outcome: each mode identifies itself, and the credential route sends nothing:

```text
/login             ng-server-context="ssg"   the sign-in form is in the HTML
/status            ng-server-context="ssr"   Healthy is in the HTML, plus an ng-state script
/secrets/a/b       no server context         <app-root></app-root>, and 0 matches for the secret words
```

The last line is the whole lab: a page that never reaches a server cannot be cached by one.

---

## Next

Lab 12 ships this: a multi-stage image beside the vault container, Caddy terminating TLS, the
deployment driven by an agent, and the live site verified afterwards.
