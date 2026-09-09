# Edit a Secret with a Signal Form

The detail pane can only be read. Making it editable means deciding what a valid secret is, and
one of those rules cannot be answered in the browser at all: whether a name is already taken in
this list is something only the vault knows. In this lab the pane becomes a Signal Form whose
name field asks the server, whose category selection is capped at three, and whose Save button
sends exactly one PUT.

------

Work in [`l04-secrets-vault-starter/`](./l04-secrets-vault-starter/). Run `claude` from the
repository root and `npm` commands in the app folder. The finished result is in
[`l04-secrets-vault-solution/`](./l04-secrets-vault-solution/).

```bash
cd labs/lab-04/l04-secrets-vault-starter
npm install
npm start
```

---

## Step 1: Put the detail fields into a form

Overview: a Signal Form wraps a writable signal holding the model, so the model is the source of
truth and the form is a tree of field state over it. The shape of that model is the API's update
contract, not the read model.

Recipe:

```text
Derive an UpdateSecret interface in src/app/secrets/update-secret.ts from the UpdateSecretRequest
record in labs/secrets-vault-mcp/Contracts/SecretContracts.cs, with name, url, user, comment,
mfa and categoryIds. Use empty strings rather than null so the inputs bind cleanly.

Create a SecretForm component in src/app/secrets taking a required secret input and a required
categories input. It holds a model signal of UpdateSecret and builds form(this.model) from
@angular/forms/signals. An effect resets the model from the secret input whenever it changes, so
opening a different row reloads the form.

Bind the fields with the formField directive: name, user and url as inputs, comment as a
textarea, mfa as a checkbox. Render SecretForm from SecretDetail in place of the read-only
definition list, keeping the version line and the deferred history below it.
```

Expected Outcome: opening a row shows its values in real inputs rather than as text, and clicking
a different row swaps every value. The Save button is present and disabled:

```text
textbox "NAME" required value="hetzner-api-token"
textbox "URL" value="https://console.hetzner.cloud"
button "Save" disabled
```

---

## Step 2: Ask the server whether the name is free

Overview: name uniqueness is per list and lives in the database, so no synchronous validator can
answer it. `validateHttp` attaches an `httpResource` to a field and turns its response into
validation errors.

Research:

```text
Read the HttpValidatorOptions interface in
node_modules/@angular/forms/types/signals.d.ts. I want the name field to be invalid when a secret
with that name already exists in the same list. GET /api/secrets/<name>?listId=<id> answers 200
when the name is taken and 404 when it is free. Tell me which option builds the request, which
one turns a response into errors, which one handles a thrown HTTP error, and what returning
undefined from the request function does.
```

Finding: the answer must name `request`, `onSuccess`, `onError` and `debounce`. The trap is the
direction: a 200 is the failure case here and a 404 is success, so `onSuccess` returns the error
and `onError` returns an empty array. Returning `undefined` from `request` skips the check
entirely, which is how the field stays valid while the name is unchanged or empty. If the answer
puts the error in `onError`, it has the polarity backwards and the form will reject every free
name.

Recipe:

```text
In the SecretForm schema, add required on name with the message "A secret always has a name."
and a validateHttp on the same field.

Its request builds /api/secrets/<encoded name>?listId=<the secret's listId>, and returns
undefined when the trimmed name is empty or equal to the secret's current name. onSuccess returns
a single error with kind nameTaken and the message "That name is already used in this list."
onError returns an empty array. Debounce it by 400 milliseconds.

In the template, show the first error under the name field in a role="alert" element once the
field is touched, and show "Checking the name" while the field is pending.
```

Expected Outcome: typing an existing name into the field puts the error under it after a beat,
and Save stays disabled:

```text
NAME  hetzner-dns-token
      That name is already used in this list.
Save  disabled
```

Typing a name nobody uses clears the error, and the network tab shows one `GET /api/secrets/...`
per pause in the typing, not one per keystroke.

---

## Step 3: Cap the category selection at three

Overview: the update contract allows at most three categories, and a rule the server enforces is
a rule the form should state. `maxLength` works on the array field directly, so the chips need no
counting logic of their own.

Give the list a fourth category first, so the cap is reachable:

```bash
curl -X POST http://localhost:5093/api/categories -H "Content-Type: application/json" -d "{\"listId\":\"2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1\",\"topic\":\"Rotation Due\",\"color\":\"#F59E0B\"}"
```

Recipe:

```text
Add maxLength(path.categoryIds, 3) to the schema with the message "At most three categories."

Render the categories as toggle buttons inside a fieldset with a legend, each carrying
aria-pressed for whether the model holds its id and a --chip custom property from the category's
color. A click adds or removes that id from the model's categoryIds array. Show the field's first
error below the strip in a role="alert" element.
```

Expected Outcome: three chips can be active at once. Turning on a fourth leaves it visually
active, reports the error and disables Save:

```text
Rotation Due  Azure  DeepInfra  Hetzner
At most three categories.
Save  disabled
```

---

## Step 4: Save once, through submit

Overview: one press of Save is one `PUT`. `submit()` runs the action, marks the form submitted,
and exposes `submitting()` for the template, so no separate saving flag is needed.

Recipe:

```text
Add a save method to SecretForm that calls submit(this.secretForm, async (field) => ...). The
action reads field().value() and PUTs it to
/api/secrets/<the secret's current name>?listId=<listId> with HttpClient, awaited through
firstValueFrom. Do not add a rename call; the name rides the same request.

On success it resets the model from the response and emits a saved output with the updated
secret. On a rejected request it sets a serverError signal reading "The vault rejected the change.
The name may have been taken meanwhile." and the template renders it in a role="alert".

Enable the Save button only when the form is dirty and valid, show "Saving" while
submitting() is true, and wire the form element's submit event to the method with
preventDefault.

In App, handle the saved output by replacing the open secret and bumping a reloadToken signal
that SecretsList takes as an input and reads inside its httpResource URL, so the row list picks
up the change.
```

Expected Outcome: editing the value and pressing Save fires exactly one request and the row list
updates behind the pane:

```text
PUT /api/secrets/hetzner-api-token?listId=2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1  200
```

Reading the secret back from the API shows the new value and a bumped version:

```text
comment: Provisions the training VPS boxes. Rotated in lab 4.
version: 2
```

---

## Step 5: Prove the error path the server owns

Overview: the async validator closes the window on a name collision but does not eliminate it,
because another client can take the name between the check and the save. The lab is not finished
until that branch has been seen.

Recipe:

```text
Walk me through the failure window: the name check passes, another client takes that name, and
the PUT arrives second. Point at the exact line in SecretForm that handles the rejected request
and tell me what the user sees. Then show me how to reproduce it against the running app without
a second browser, using one curl call against the API while the form sits unsaved.
```

Expected Outcome: the answer names the catch branch that sets `serverError` and shows a
reproduction along these lines: open a secret, type a free name, then rename another secret to
that same name with a `PUT`, then press Save. The form shows the server message rather than
silently keeping the old value:

```text
The vault rejected the change. The name may have been taken meanwhile.
```

---

## Next

Lab 5 leaves the resource APIs for the cases they do not cover: uploading a vault file with a
progress bar, exporting a blob, and retrying a failed request with backoff.
