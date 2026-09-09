# Put the Workbench State in the URL

Six labs of state and not one of it is shareable. A colleague cannot be sent a link to a secret,
a browser reload loses the selection, and the back button does nothing. In this lab the selected
list and the open secret become route parameters, a guard sends anonymous visitors to a login
page, an interceptor carries the token on every call, and a resolver makes a deep link work on a
cold load.

------

Work in [`l07-secrets-vault-starter/`](./l07-secrets-vault-starter/). Run `claude` from the
repository root and `npm` commands in the app folder. The finished result is in
[`l07-secrets-vault-solution/`](./l07-secrets-vault-solution/).

This is the lab where authentication is switched on, so the container has to be restarted with
the flag set:

```bash
docker rm -f secrets-vault
docker run -d --name secrets-vault -p 5093:5093 -e Auth__Enabled=true -e Mcp__ApiKeys__0__Name=angular-lab -e Mcp__ApiKeys__0__Key=lab-secrets-vault-key -e Mcp__ApiKeys__0__Grants__0=secrets-mcp/lists -e Mcp__ApiKeys__0__Grants__1=secrets-mcp/secrets secrets-vault-mcp:local
curl -i http://localhost:5093/api/lists
```

That last call now answers `401 Unauthorized`, which is what the rest of the lab is about. The
two seeded users are `owner` / `Owner#Vault2026!` and `customer` / `Customer#Vault2026!`.

```bash
cd labs/lab-07/l07-secrets-vault-starter
npm install
npm start
```

---

## Step 1: Hold the session and put it on every request

Overview: the API answers a login with a bearer token, and every later call has to carry it. A
functional interceptor is the one place that happens, and it is also the only place that can see
a 401 arrive and act on it.

Recipe:

```text
Create src/app/auth/auth-store.ts: an AuthStore using the @Service decorator, holding a private
session signal of { token, name, roles } or null, with computed user, roles and isSignedIn, a
token() accessor, a restore() that reads the session back from localStorage under the key
secrets-vault-session, a signIn(name, password) that POSTs /api/auth/login and stores the
response, and a signOut() that clears both.

Create src/app/auth/auth.interceptor.ts: a functional HttpInterceptorFn that clones the request
with an Authorization bearer header when a token exists, the url starts with /api and it is not
the login call itself. It catches a 401 on any other call, signs the user out and navigates to
/login.

Register it with provideHttpClient(withInterceptors([authInterceptor])) in app.config.ts, and
restore the session before the first route resolves with
provideAppInitializer(() => inject(AuthStore).restore()).
```

Expected Outcome: with a stored session the network panel shows `Authorization: Bearer ...` on
`/api/lists` and no header on `/api/auth/login`. Corrupting the stored token and reloading lands
on the login page with the session cleared:

```text
localStorage secrets-vault-session -> null
location.pathname                  -> /login
```

---

## Step 2: Build the login page and guard the workbench

Overview: a guard that returns `false` leaves the user on a blank screen. Returning a `UrlTree`
redirects them and carries where they were going, so the login can send them back.

Recipe:

```text
Create src/app/pages/login-page.ts, a standalone component with an inline template. It builds a
Signal Form over a { name, password } model with required on both fields, binds them with
formField, and on submit calls AuthStore.signIn. On success it navigates to the next query
parameter or /secrets; on failure it sets a failure signal reading "That user name and password
were not accepted." and the template shows it in a role="alert". Style the card from the design
tokens.

Create src/app/auth/auth.guard.ts: a CanActivateFn that returns true when signed in and otherwise
returns router.createUrlTree(['/login'], { queryParams: { next: state.url } }).
```

Expected Outcome: visiting `/secrets` while signed out lands on the login page with the
destination preserved, and signing in returns there:

```text
/secrets  ->  /login?next=%2Fsecrets  ->  /secrets/2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1
```

---

## Step 3: Route the selection and bind the parameters as inputs

Overview: `withComponentInputBinding` turns route parameters into signal inputs, so the page reads
`listId()` and `secretId()` instead of subscribing to `ActivatedRoute`. The store then follows the
URL rather than the other way round.

Research:

```text
The workbench selection lives in SecretsStore today. I want /secrets/:listId to select a list and
/secrets/:listId/:secretId to also open a secret, with the store following the URL. Compare
reading the parameters through ActivatedRoute.paramMap, through withComponentInputBinding plus
input(), and through a resolver that writes the store directly. Say which one survives a browser
back navigation without extra code, and where the store write belongs in each.
```

Finding: the answer should land on `withComponentInputBinding`, because the router already
re-evaluates inputs on every navigation including back and forward, so no subscription and no
cleanup are needed. Watch for an answer that writes the store from the resolver: that runs before
the component exists and does not re-run when only the parameter changes on the same route, so
back navigation silently keeps the old selection.

Recipe:

```text
Create src/app/pages/secrets-page.ts by moving the workbench markup out of App. It takes a
required listId input and an optional secretId input, and two effects push them into the store
through selectList and openSecretById. Its header shows the signed-in user and roles plus a Sign
out link.

Reduce App to a router-outlet shell. Write src/app/app.routes.ts with a redirect from '' to
secrets, a lazily loaded login route, and lazily loaded secrets, secrets/:listId and
secrets/:listId/:secretId routes behind authGuard, plus a wildcard back to secrets.

Turn the list cards into anchors with routerLink and routerLinkActive instead of buttons, and the
secret rows into anchors pointing at /secrets/<listId>/<secretId>. Delete the outputs they no
longer need.

Enable provideRouter(routes, withComponentInputBinding(), withViewTransitions()).
```

Expected Outcome: clicking a list and then a row writes both into the address bar, and the browser
back button walks the selection backwards:

```text
/secrets/a9794369-...                      Team Documents, 5 rows
/secrets/a9794369-.../3dadf2a3-...         detail pane on architecture-overview
```

---

## Step 4: Send an empty route to the first list

Overview: `/secrets` on its own has no list to show. A guard that loads the lists and redirects to
the first one keeps that decision out of the component and out of the store's init.

Recipe:

```text
Create src/app/pages/first-list.guard.ts: a CanActivateFn that loads the lists into the store when
none are loaded, then returns router.createUrlTree(['/secrets', <first list id>]), or true when
there are no lists at all.

Put it on the bare secrets route after authGuard, and remove the auto-select branch from
loadLists in with-lists.ts plus the loadLists call from the store's onInit hook: the route is now
what decides.
```

Expected Outcome: `/secrets` never renders itself; it redirects, and the address bar shows the
list id:

```text
/secrets  ->  /secrets/2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1
```

---

## Step 5: Make a deep link work on a cold load

Overview: a link to a secret arrives with an empty store, so the page renders the list pane empty
and the detail pane missing. A resolver on the parameterised routes fills the gap before the
component is created.

Recipe:

```text
Create src/app/pages/lists.resolver.ts: a ResolveFn that loads the lists into the store when the
store holds none, and returns true. Add it as resolve: { lists: listsResolver } to both
secrets/:listId and secrets/:listId/:secretId.

Then update the two specs the routing broke: SecretRow now needs provideRouter([]) because it
renders a routerLink, and the store spec must call loadLists itself and assert the selection
through selectList rather than expecting an automatic first list.
```

Expected Outcome: pasting a secret URL into a fresh tab renders the whole workbench in one go:

```text
path            /secrets/a9794369-.../3dadf2a3-...
list heading    Team Documents
detail heading  architecture-overview
rows            5
active card     Team Documents
```

`npx ng test --watch=false` runs green with the two updated specs.

---

## Next

Lab 8 puts this under test: Vitest specs for the store features and the collision path in the
form, and a Playwright run that creates, renames and deletes a secret against the real API.
