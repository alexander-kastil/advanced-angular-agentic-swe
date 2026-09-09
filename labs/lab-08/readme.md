# Let the Agent Write the Specs and Prove Them by Mutation

An agent will write you a hundred passing tests in a minute, and passing tests are not the
product. In this lab the agent writes specs for the parts of the workbench that would fail
quietly, a Playwright run drives the real API end to end, and then you break the code on purpose
to find out which of those specs were doing any work.

------

Work in [`l08-secrets-vault-starter/`](./l08-secrets-vault-starter/). Run `claude` from the
repository root and `npm` commands in the app folder. The finished result is in
[`l08-secrets-vault-solution/`](./l08-secrets-vault-solution/).

The auth-enabled container from lab 7 must be running.

```bash
cd labs/lab-08/l08-secrets-vault-starter
npm install
npm start
```

---

## Step 1: Test the session and the header it produces

Overview: the auth store and the interceptor are the two pieces where a silent failure logs
everybody out or, worse, sends no token and gets a 401 the user never understands. Both are
testable without a component.

Recipe:

```text
Write src/app/auth/auth-store.spec.ts with TestBed, provideHttpClient and provideHttpClientTesting.
Cover three cases: a sign in posts { name, password } to /api/auth/login and leaves user, roles
and token readable afterwards; restore() rehydrates a session written into localStorage under
secrets-vault-session; and signOut() clears both the signal and the storage key. Clear
localStorage in beforeEach and afterEach.

Write src/app/auth/auth.interceptor.spec.ts against provideHttpClient(withInterceptors([authInterceptor])).
Cover three cases: an /api call carries Authorization: Bearer <token>; the login call carries no
Authorization header at all; and a 401 on any other call signs the user out. Assert the
navigation with a spy on Router.navigate rather than reading router.url, because the navigation
is asynchronous and an empty test route table has nowhere to go.
```

Expected Outcome: six specs run green, and the interceptor spec asserts the header rather than
the absence of an error:

```text
adds the bearer token to an api call     Authorization -> Bearer jwt-token
leaves the login call unsigned           headers.has('Authorization') -> false
signs out and routes to login on a 401   navigate -> ['/login']
```

---

## Step 2: Test the form paths that only the server can trigger

Overview: the interesting states of the Signal Form are the ones a happy-path test never reaches:
the name the vault already holds, and the fourth category. Both need the HTTP testing controller
and both need the debounce to be waited out rather than ignored.

Research:

```text
Read src/app/secrets/secret-form.ts. I want a Vitest spec for the nameTaken error from
validateHttp. Tell me why the request does not appear in HttpTestingController immediately after
the model changes, and why awaiting fixture.whenStable() before flushing that request hangs the
test instead of resolving it.
```

Finding: the answer must name the 400 millisecond `debounce` on the validator as the reason the
request is not queued yet, and it must explain that `whenStable()` waits for pending tasks,
which include the very request that is waiting to be flushed, so awaiting it before the flush
deadlocks. The working order is: change the model, wait past the debounce, flush, then assert. An
answer that reaches for `fakeAsync` has the wrong tool: this app is zoneless.

Recipe:

```text
Write src/app/secrets/secret-form.spec.ts with a mount helper that creates the fixture and sets
the secret and categories inputs with componentRef.setInput. Use four categories so the cap is
reachable.

Cover three cases: the model is filled from the secret input with nulls mapped to empty strings;
setting the name to another secret's name produces a nameTaken error and leaves canSave false,
waiting past the debounce and flushing /api/secrets/<name>?listId=l1 before asserting; and
toggling all four categories leaves four ids in the model, an error on the categoryIds field and
canSave false.
```

Expected Outcome: `npx ng test --watch=false` reports sixteen specs green, and the collision spec
asserts the error kind rather than a message string:

```text
secretForm.name().errors().map(e => e.kind)  ->  contains 'nameTaken'
canSave()                                    ->  false
```

---

## Step 3: Drive the real thing with Playwright

Overview: unit specs mock the API away, which is exactly what makes them fast and exactly what
makes them blind to the contract. One end-to-end run against the running container covers the
whole path: sign in, find, rename, delete.

```bash
npm install -D @playwright/test
npx playwright install chromium
```

Recipe:

```text
Add playwright.config.ts with testDir ./e2e, one chromium project, a baseURL of
http://localhost:4200, a single worker, and a webServer block running npm start with
reuseExistingServer true. Add an e2e script to package.json running playwright test.

Write e2e/secret-lifecycle.spec.ts. A beforeEach signs in through the login page as owner and
waits for the Cloud Provider Keys link. The test itself gets a token through the API request
context, creates a probe secret through POST /api/secrets, finds it in the UI through the search
box, opens it, renames it in the form, saves, verifies the new name through the API, deletes it
through the API, and finally confirms the UI shows the filtered empty state.

The beforeEach also deletes both probe names through the API first: a run that failed halfway
leaves a row behind and two matching rows break a strict-mode locator.
```

Expected Outcome: `npx playwright test` passes and the run exercises the real API rather than a
mock:

```text
✓ 1 [chromium] › e2e\secret-lifecycle.spec.ts › creates, renames and deletes a secret
1 passed
```

---

## Step 4: Follow the identity the API actually returns

Overview: the end-to-end run is the first thing that sees a rename from the outside, and it fails
where a unit test cannot: after a save, the detail pane goes blank. The cause is a fact about the
vault that none of the mocks encode.

Research:

```text
The Playwright run renames a secret and then cannot find the heading with the new name, although
GET confirms the rename worked. Compare the secretId before and after a PUT against the running
API with two curl calls. Then explain what that does to the store's openSecret computed and to
the secretId in the route, and propose the smallest fix.
```

Finding: the two calls show a different `secretId` after the PUT, because the API writes a new
version row rather than editing the old one. `openSecret` looks the entity up by the id in the
route, and that id now belongs to the previous version, so the lookup returns nothing. The
smallest fix is to navigate to the returned id after a save; patching the store alone leaves the
URL pointing at the old version and the next route evaluation undoes it.

Recipe:

```text
Give SecretsPage an onSaved(secret) method that navigates to /secrets/<listId>/<the saved
secret's id> and then reloads the secrets, and bind the SecretDetail saved output to it instead
of calling store.loadSecrets directly. Comment the line that says why the id changes.
```

Expected Outcome: the Playwright run goes green, and the address bar carries the new version's id
after a save:

```text
before save  /secrets/2b6344c5-.../01a085be-54b4-78d4-b7b3-06a310463feb
after save   /secrets/2b6344c5-.../01a085be-5503-7271-b890-9763f1cb18cd
```

---

## Step 5: Break the code and see which specs notice

Overview: a green suite proves the tests ran, not that they test anything. Changing one character
in the code and re-running is the cheapest way to find out, and it is the only step in this lab
that can tell you a spec is worthless.

Recipe:

```text
Run two mutations, one at a time, restoring the file after each.

First change the 401 check in auth.interceptor.ts to 403 and run npx ng test --watch=false. Then
restore it, change maxLength(path.categoryIds, 3) to 4 in secret-form.ts, and run again.

Report for each mutation which spec failed and which specs stayed green. Then tell me which
production line is currently covered by no failing spec at all when mutated, and write the spec
that would catch it.
```

Expected Outcome: each mutation kills exactly the spec that claims to cover it, and nothing else:

```text
401 -> 403   × signs out and routes to login on a 401     15 passed, 1 failed
cap 3 -> 4   × caps the category selection at three       15 passed, 1 failed
restored     16 passed
```

A mutation that kills nothing is a hole; a mutation that kills five specs means five specs are
testing the same thing.

---

## Next

Lab 9 turns the workbench itself into something an agent can drive, exposing the store, the form
and the router as WebMCP tools, and deciding which of them must never be exposed.
