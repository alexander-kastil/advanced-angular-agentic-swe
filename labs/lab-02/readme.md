# Load the Secrets of a List with Signals

The workbench shows five cards and nothing else: clicking one does nothing, and there is no way
to look inside a list. In this lab the selection becomes state, the secrets of the selected list
load themselves whenever that state changes, a search box narrows them without firing a request
per keystroke, and every value on screen starts masked. All of it is signals; no subscription is
written anywhere.

------

Work in [`l02-secrets-vault-starter/`](./l02-secrets-vault-starter/), which is lab 1's finished
workbench. Run `claude` from the repository root and `npm` commands in the app folder. The
finished result is in [`l02-secrets-vault-solution/`](./l02-secrets-vault-solution/).

```bash
cd labs/lab-02/l02-secrets-vault-starter
npm install
npm start
```

The vault container from lab 1 must be running; `docker start secrets-vault` if you stopped it.

---

## Step 1: Turn the selection into state the child owns jointly

Overview: the list cards need to report which one is active, and the shell needs to know so it
can load that list's secrets. `model()` is the one input that writes back, so the parent binds
`[(selectedListId)]` and the card sets it directly.

Recipe:

```text
In labs/lab-02/l02-secrets-vault-starter, move the lists resource out of the SecretLists
component and into App, so App owns httpResource for /api/lists and SecretLists becomes
presentational.

Give SecretLists a required input lists of SecretList[] and a model selectedListId of
string | null defaulting to null. Keep the two computed groups for Secrets and Vault. Render
each card as a button rather than a plain li: it sets selectedListId to that list's id on click,
carries aria-pressed for whether it is the selected one, and gets a .selected class using the
accent border from the design tokens.

In App, hold the selection in a plain signal for now, bind [lists]="all()" and
[(selectedListId)]="selectedListId", and render the selected list's name as an h2 below the
cards. Keep the loading and error states in App.
```

Expected Outcome: clicking a card moves the highlight and changes the heading below the grid.
The accessibility tree shows exactly one pressed button:

```text
button "Cloud Provider Keys ... 7 secrets" pressed
button "Training Logins ... 7 secrets"
```

---

## Step 2: Default the selection with linkedSignal

Overview: a plain signal starts at `null`, so the first paint has no list selected and the user
has to click before seeing anything. `linkedSignal` gives a signal a source it derives from while
staying writable, which is exactly the shape of a selection that follows its list.

Research:

```text
The selection in App is a plain signal starting at null. I want it to default to the first list
once /api/lists resolves, stay on whatever the user picked afterwards, and fall back to the first
list again if the picked list disappears from a later load. Compare doing this with an effect
that writes the signal, with computed(), and with linkedSignal(). For each, say what happens on
the second load of /api/lists and whether the user's click survives it.
```

Finding: a `computed()` is not writable, so the click has nowhere to go. An `effect()` that
writes the signal works but has to guard against overwriting the user's choice on every
re-evaluation, and writing signals from effects is the pattern this course avoids. `linkedSignal`
is the one that carries both: it takes a `source` and a `computation` that receives the previous
value, so preserving a still-valid selection is one condition rather than a guard. If the answer
proposes an effect, push back and ask for the `linkedSignal` version with the previous value.

Recipe:

```text
Replace the plain selection signal in App with a linkedSignal whose source is the computed list
array and whose computation keeps the previous value when that list id is still present, and
otherwise falls back to the first list's id or null when there are none.

Then add an effect in the App constructor that writes document.title as
"<selected list name> - Secrets and Document Vault", falling back to the app name alone when
nothing is selected. Inject DOCUMENT rather than touching the global.
```

Expected Outcome: a reload lands on Cloud Provider Keys already selected, and the browser tab
title tracks the selection:

```text
before click   Cloud Provider Keys - Secrets and Document Vault
after click    Team Documents - Secrets and Document Vault
```

---

## Step 3: Load the secrets of the selected list

Overview: `httpResource` re-fetches whenever a signal in its URL changes, so a component that
reads the selected list id needs no reload call, no subscription and no `ngOnChanges`.

Recipe:

```text
Generate a SecretsList component under src/app/secrets. Derive a Secret interface from
labs/secrets-vault-mcp/Contracts/SecretContracts.cs, one field per record property, in
src/app/secrets/secret.ts.

SecretsList takes a required listId input and loads /api/secrets?listId=<id> with httpResource.
Render the rows as a table with Name, User, Value and MFA columns, the name as a row header, the
comment in the Value column and the row count in the caption. Give it a loading state, an error
state and an empty state. Style it from the design tokens: uppercase muted column headers, a
one-pixel border under each row, no vertical rules.

Render it from App below the selected list heading, passing the selected list id.
```

Expected Outcome: selecting Cloud Provider Keys fills the table with its 7 rows, and the count
in the caption matches the count on the card. Selecting Team Documents replaces them with 5. The
network tab shows one request per selection, with the id in the query string:

```text
GET /api/secrets?listId=2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1  200
GET /api/secrets?listId=a9794369-8836-4b9f-a22f-550e15be6167  200
```

---

## Step 4: Narrow the table with a debounced search

Overview: the API filters server side over `?search=`, so the search box only has to put the term
into the resource's URL. Feeding the raw signal in would fire a request per keystroke, and
`debounced()` is the signal-native way to wait for the typing to stop.

Recipe:

```text
Add a search signal to SecretsList and a labelled search input bound to it. Wrap the signal in
debounced() from @angular/core with a 300 millisecond wait, and read the debounced resource's
value inside the httpResource URL: append &search=<term> when the trimmed term is non-empty and
omit the parameter entirely when it is empty. Build the query string with URLSearchParams.

Add a computed isFiltered from the same debounced value, and use it so the empty state reads
"No secret in this list matches that search." while filtering and "This list is empty."
otherwise.
```

Expected Outcome: typing `hetzner` into the box leaves the table at 7 rows for a moment and then
drops it to 2, and the network tab holds one request for the whole word rather than seven:

```text
GET /api/secrets?listId=2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1&search=hetzner  200
```

Switching to Team Documents with the term still in the box shows the filtered empty state.

---

## Step 5: Mask every value behind a reusable control

Overview: a credential manager that prints its values on screen is a screenshot away from a
leak. The reveal state belongs to each row rather than to the table, and `model()` lets the
parent take it over later without the control changing.

Recipe:

```text
Create a MaskedValue component in src/app/shared with an inline template. It takes a value input
of string | null, a label input for the button's accessible name, and a revealed model defaulting
to false. A computed display returns "not set" when the value is empty, the value itself when
revealed, and a run of bullet characters capped at 24 otherwise. The button toggles revealed,
carries aria-pressed, and reads Reveal or Hide.

Use it in the Value column of the secrets table, passing each row's comment and an accessible
label naming that secret. Style it from the design tokens: monospace value, muted italic when
not set, accent border and text on hover.
```

Expected Outcome: every row's value renders as bullets and one Reveal button per row. Pressing
one swaps that row only:

```text
hetzner-api-token   ••••••••••••••••••••••••   Reveal
hetzner-api-token   Provisions the training VPS boxes.   Hide
```

The button reports `pressed` in the accessibility tree while revealed, and the other rows stay
masked.

---

## Next

Lab 3 splits this single page into a list pane and a detail pane with a splitter, and turns the
row, the category chips and the masked control into composed components with signal queries and
content projection.
