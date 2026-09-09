# Upload, Export and Retry with RxJS

`httpResource` covers reading. It has nothing to say about an upload you want to watch, a
response you want as a file rather than as JSON, or a request that should be tried again before
it is called failed. In this lab the vault lists get a file upload with a live progress bar, a
CSV export that lands in the downloads folder, and one retry operator that every risky call in
the app shares.

------

Work in [`l05-secrets-vault-starter/`](./l05-secrets-vault-starter/). Run `claude` from the
repository root and `npm` commands in the app folder. The finished result is in
[`l05-secrets-vault-solution/`](./l05-secrets-vault-solution/).

```bash
cd labs/lab-05/l05-secrets-vault-starter
npm install
npm start
```

---

## Step 1: Write the retry operator the whole app will share

Overview: retrying is not one line of `retry(3)`. A 400 means the request was wrong and will stay
wrong, so retrying it wastes the user's time; a 503 deserves another go, after a wait that grows.
That decision belongs in one operator rather than at every call site.

Recipe:

```text
Create src/app/vault/retry-with-backoff.ts exporting a retryWithBackoff<T> function returning a
MonoTypeOperatorFunction<T>, with an attempts parameter defaulting to 3 and a firstDelay
defaulting to 400 milliseconds.

It wraps rxjs retry with a count and a delay callback. The callback rethrows immediately when the
error carries a status below 500, so client errors are not retried, and otherwise returns a timer
whose wait doubles per retry count.

Add a spec beside it covering three cases: a 503 that succeeds on the third call, a 500 that
exhausts the attempts, and a 400 that is never retried. Assert the call count in each.
```

Expected Outcome: `npx ng test --watch=false` runs the three cases green, and the call counts show
the policy rather than the happy path:

```text
503 succeeding on the third call   calls = 3
500 exhausting 2 attempts          calls = 3, rejected
400 client error                   calls = 1, rejected
```

---

## Step 2: Upload a file and watch it arrive

Overview: progress is an HTTP event stream, not a response, so the request has to be made with
`reportProgress` and `observe: 'events'`. Mapping those events into a signal keeps the template
on signals while the transport stays an observable.

Research:

```text
POST /api/secrets/upload takes multipart/form-data with listId, file, name, comment and
categoryIds, as the Upload action in
labs/secrets-vault-mcp/Controllers/SecretsController.cs shows. I want a progress bar while the
file goes up. Tell me which HttpClient options produce progress events, which event type carries
loaded and total, and why the same call cannot be written with httpResource.
```

Finding: the answer must name `reportProgress: true` together with `observe: 'events'`, and
`HttpEventType.UploadProgress` as the event carrying `loaded` and `total`. It should also say
that `httpResource` models one value from a GET and exposes no intermediate events, which is why
this call stays on `HttpClient`. Push back if it suggests polling or a second endpoint.

Recipe:

```text
Create a VaultUpload component in src/app/vault taking a required listId input and emitting an
uploaded output carrying the created Secret.

A hidden file input triggers the upload. Build a FormData with listId, the file under the key
file, and a name derived from the file name without its extension. POST it to
/api/secrets/upload with reportProgress true and observe events, pipe it through tap to write
UploadProgress events into a progress signal as a rounded percentage, then through
retryWithBackoff(3), then map the Response event to its body.

Hold the lifecycle in a state signal with idle, uploading, done and failed, plus fileName and
failure signals. The template shows a progress element and the percentage while uploading, the
stored message when done, and the failure text otherwise, inside an aria-live="polite" region.

Render VaultUpload from App above the rows, only for lists whose type is 2.
```

Expected Outcome: the upload bar appears on Team Documents and Deployment Certificates and not on
the Secrets lists. Picking a file stores it and the row list gains it:

```text
retention-policy  file=retention-policy.txt  size=8200
```

On localhost the transfer usually finishes inside one frame, so the bar jumps straight to the
stored message. Throttle the connection in the browser's network panel to watch the percentage
climb.

---

## Step 3: Take the export as a blob

Overview: `/api/secrets/export` answers with CSV, not JSON, so the default parse would throw on
the first character. `responseType: 'blob'` keeps the bytes intact and an object URL hands them
to the browser as a download.

Recipe:

```text
Add an export method to VaultUpload that GETs /api/secrets/export with responseType blob, pipes
it through retryWithBackoff(3), then creates an object URL, clicks a generated anchor with the
download attribute set to secrets-export.csv, and revokes the URL afterwards.

Add an Export all secrets as CSV button beside the file picker, styled like it.
```

Expected Outcome: the button saves a file whose first line is the header row the server writes:

```text
List;Name;Url;User;Password;Comment;Mfa;Categories;Version;LastChanged
```

The response arrives as `text/csv`, so nothing in the client tried to parse it as JSON.

---

## Step 4: Move the version history onto rxResource

Overview: the history is still an `httpResource`, which cannot be piped, so it cannot use the
retry operator from step 1. `rxResource` keeps the resource shape the template already reads and
takes an observable stream, which is where the operator goes.

Recipe:

```text
Replace the httpResource in SecretDetail with rxResource from @angular/core/rxjs-interop. Its
params return the secret's name and listId, and its stream calls HttpClient for
/api/secrets/versions/<encoded name>?listId=<listId> piped through retryWithBackoff(3).

Leave the @defer block, the placeholder button and the template bindings untouched.
```

Expected Outcome: the deferred history still loads on the first press of the button and renders
the same lines, now through a retried request:

```text
before   Show version history
after    v1 changed 2026-09-09T10:22:56
```

---

## Step 5: Have the agent find the flattening bug you have not written yet

Overview: the upload path is one request at a time, but the moment two are in flight the choice
between `switchMap`, `concatMap`, `mergeMap` and `exhaustMap` decides whether files are lost,
queued or ignored. The point of this step is to reason about that before the code needs it.

```text
Read src/app/vault/vault-upload.ts. Today a second upload started while the first is running
would race it. Rewrite the upload path so a queue of files is uploaded one after another, and
tell me which flattening operator you chose and what the other three would have done to the
progress signal and to the stored files. Then say which operator the export button should use if
a user clicks it four times in a row, and why that answer is different.
```

Expected Outcome: the answer implements a queue with `concatMap` and explains that `mergeMap`
interleaves progress from several files into one signal, `switchMap` cancels the file already
going up, and `exhaustMap` drops the newly picked file silently. For the export button it should
choose `exhaustMap`, because four clicks want one download rather than four, which is the
opposite trade to the queue.

---

## Next

Lab 6 replaces the signals scattered across App, SecretsList and SecretDetail with one
`SecretsStore` built from `withState`, `withComputed`, `withMethods` and `withEntities`.
