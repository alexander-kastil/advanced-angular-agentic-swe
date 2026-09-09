# Compose the Workbench from Accessible Components

Everything is in one component: the list grid, the search box, the table and the masking all
live in two files that only get longer. In this lab the page becomes a resizable two-pane
workbench built from parts that each own one job, and the parts that a keyboard user has to
operate are built on `@angular/aria` rather than on `div` elements with click handlers. The
version history loads only when someone asks for it.

------

Work in [`l03-secrets-vault-starter/`](./l03-secrets-vault-starter/). Run `claude` from the
repository root and `npm` commands in the app folder. The finished result is in
[`l03-secrets-vault-solution/`](./l03-secrets-vault-solution/).

```bash
cd labs/lab-03/l03-secrets-vault-starter
npm install
npm start
```

---

## Step 1: Split the page with a resizable pane

Overview: the lists and the secrets compete for the same column, so the first move is a
two-pane layout whose divider the user can drag. A directive owns the width, and the shell reads
it through a signal view query rather than through a shared service.

Recipe:

```text
Create a Splitter directive in src/app/shared, selector appSplitter. It exposes a width signal
starting at 320 and clamped between 240 and 640. Its host object gives it role="separator",
aria-orientation="vertical", tabindex 0, aria-valuenow bound to the width plus matching
aria-valuemin and aria-valuemax, a pointerdown handler that tracks pointermove on the window and
updates the width from the horizontal delta, and arrow-left and arrow-right key handlers that
nudge the width by 24. Use the host object, never @HostListener.

Rework App into a three-column grid: an aside holding SecretLists, the splitter element, and a
main holding the selected list. Read the directive with viewChild.required(Splitter) and feed
its width into a --pane custom property on the grid, whose first column is var(--pane).
```

Expected Outcome: dragging the divider widens the list pane and stops at both ends. Focusing it
and pressing the arrow keys moves it in steps, and the accessibility tree names it:

```text
separator "Resize the list pane" orientation="vertical" value="320" valuemin="240" valuemax="640"
```

---

## Step 2: Make a row out of the table row

Overview: a table row that carries a name, a masked value and a set of actions is three concerns
in one `tr`. As a component with a projection slot, the row decides its own layout and the list
decides what goes in the actions slot.

Recipe:

```text
Create a SecretRow component in src/app/secrets with an inline template. It takes a required
secret input and emits an opened output carrying that secret. It renders the name and user as
one button that emits opened, the masked value next to it, and an <ng-content select="[slot=actions]" />
for whatever the parent projects. Lay it out as a three-column grid with a bottom border, styled
from the design tokens.

Replace the table in SecretsList with a stack of SecretRow elements, and lift the opened output
up to App, which stores the chosen secret in a signal and clears it whenever the selected list
changes.
```

Expected Outcome: the table markup is gone and each row reads as one heading-plus-value line.
Clicking a row name records it in App, and switching lists clears the record. The projected slot
is still empty at this point; step 4 fills it.

---

## Step 3: Filter by category with an accessible chip strip

Overview: a chip that filters is a listbox option, not a styled `span`. `@angular/aria` ships the
keyboard behaviour, the roles and the selection state, so the component supplies the look and the
data only.

```bash
npm install @angular/aria@22
```

Research:

```text
Read the Listbox and Option directives in node_modules/@angular/aria/types/listbox.d.ts. I want a
horizontal strip of category chips that filters a list: several can be active at once, arrow keys
must move between them, and nothing may be selected on first paint. Tell me which inputs on
ngListbox control multiple selection, orientation and whether focus also selects, and what the
value model holds.
```

Finding: the answer must name `multi` for multiple selection, `orientation="horizontal"`, and
`selectionMode`, whose two values are `follow` and `explicit`. The default is `follow`, which
selects whatever gets focus, so a strip left on the default arrives with its first chip already
active and the list already filtered. `value` is a `model` holding an array of the option values,
so it binds with `[(value)]`. If the answer omits `selectionMode`, ask what the strip looks like
before the user touches it.

Recipe:

```text
Create a CategoryChips component in src/app/secrets with an inline template. It takes a required
categories input of Category[], derived from labs/secrets-vault-mcp/Contracts/CategoryContracts.cs
into src/app/secrets/category.ts, and a selected model holding a string array of category ids.

Render a div with ngListbox, multi, selectionMode="explicit", orientation="horizontal",
[(value)]="selected" and an aria-label. Inside it, one span per category with ngOption, the
category id as value and the topic as label. Style the chips as rounded pills that take their
border and selected background from the category's own color through a --chip custom property
and color-mix, with a visible focus ring.

In SecretsList, load /api/categories?listId=<id> with a second httpResource, render the strip
above the rows, and narrow the rendered rows to those whose categoryIds intersect the selection.
An empty selection means no filtering.
```

Expected Outcome: the strip renders with nothing selected and all rows visible. Clicking Hetzner
narrows the rows to that category and the count line follows:

```text
before   7 of 7 secrets shown   option "Hetzner 2" selectable
after    2 of 7 secrets shown   option "Hetzner 2" selectable selected
```

Arrow keys move between chips without selecting them, and space or enter toggles the focused one.

---

## Step 4: Compose copy into the masked control and project a menu

Overview: copy-to-clipboard is behaviour, not markup, so it belongs in a directive that any host
can compose in. The overflow menu is the other half: it goes into the row's actions slot from
outside, so the row never learns what the actions are.

Recipe:

```text
Create a CopyToClipboard directive in src/app/shared, selector appCopyToClipboard, with a value
input of the same name, a copied signal, a click handler that writes the value to
navigator.clipboard and flips copied for 1.5 seconds, and a data-copied host attribute bound to
it. Compose it into MaskedValue with hostDirectives, forwarding the appCopyToClipboard input, and
add a :host([data-copied='true'])::after rule that shows the word copied in the accent color.

Then create a SecretMenu component in src/app/secrets using @angular/aria/menu: a trigger button
carrying ngMenuTrigger with [menu] bound to the panel, and a div with ngMenu whose items live
inside an ng-template ngMenuContent. Give each item ngMenuItem and a value, one for Copy value
and one for Show versions. Hide the panel with a .menu:not([data-visible='true']) rule, since the
directive drives visibility through that attribute.

Project SecretMenu into each SecretRow through slot="actions".
```

Expected Outcome: clicking a masked value copies it and the word copied appears beside it for a
moment. The overflow button opens a real menu, and the accessibility tree shows the popup
relationship rather than a floating div:

```text
button "Actions for hetzner-api-token" expandable expanded haspopup="menu"
  menu orientation="vertical"
    menuitem "Copy value" focusable focused
    menuitem "Show versions"
```

---

## Step 5: Defer the version history until it is asked for

Overview: the detail pane loads for every secret the user opens, and its version history is a
second request nobody has asked for yet. `@defer (on interaction)` keeps that code and that
request out of the page until the button is pressed.

Recipe:

```text
Create a SecretDetail component in src/app/secrets with an inline template, taking a required
secret input. It renders name, user, url, the masked value, MFA and version as a definition list
styled from the tokens.

Below it, add a @defer (on interaction(historyTrigger)) block rendering the version list from an
httpResource on /api/secrets/versions/<name>?listId=<listId>, with an @empty branch. The
@placeholder holds a button with the template reference historyTrigger reading Show version
history, and @loading shows a one-line loading state.

Render SecretDetail from App inside a section labelled Secret detail whenever a secret is open.
```

Expected Outcome: opening a secret shows its fields and a Show version history button, with no
request to `/api/secrets/versions/`. Pressing the button replaces it with the history and fires
that request once:

```text
placeholder   button "Show version history"
after press   v1 changed 2026-09-01T09:00:00Z
```

---

## Next

Lab 4 makes the detail pane editable: the fields become a Signal Form over `UpdateSecret`, with
a server-checked name, a category array capped at three, and one PUT per save.
