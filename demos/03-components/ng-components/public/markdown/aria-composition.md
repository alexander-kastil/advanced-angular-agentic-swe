# Accessible Composition with @angular/aria

`@angular/aria` is a headless behaviour package: directives that own the ARIA roles, the ARIA state,
roving tabindex, typeahead and keyboard navigation, while you keep full control of the markup and
the CSS. It is not Angular Material. There is no theme, no elevation, no ripple.

```bash
npm i @angular/aria
```

Available entry points: `accordion`, `combobox`, `grid`, `listbox`, `menu`, `tabs`, `toolbar`,
`tree`, each with a matching `/testing` harness entry point.

## Tabs

```html
<div ngTabs>
  <ul ngTabList [(selectedTab)]="selectedTab">
    <li ngTab value="sighthounds">Sighthounds</li>
    <li ngTab value="cats">Cats</li>
    <li ngTab value="retired" [disabled]="true">Retired</li>
  </ul>

  <div ngTabPanel value="sighthounds">
    <ng-template ngTabContent>...</ng-template>
  </div>
</div>
```

- `ngTabList` owns `role="tablist"`, arrow key navigation, `aria-orientation` and
  `aria-activedescendant`, and exposes `selectedTab` as a model input.
- `ngTab` owns `role="tab"`, `aria-selected`, `aria-controls` and the roving `tabindex`, and mirrors
  its state onto a `data-active` attribute for styling.
- `ngTabPanel` owns `role="tabpanel"` and marks the inactive panels `inert`.
- `ng-template ngTabContent` makes the panel content deferred: only the selected panel's content is
  in the DOM. Set `preserveContent` on the panel to keep it once rendered.

Because the state lands on attributes, the CSS is plain attribute selectors:

```scss
.tab[aria-selected='true'] { font-weight: bold; }
.tab[data-active='true']  { outline: 2px solid var(--color-primary); }
.tabpanel[inert]          { display: none; }
```

## Listbox

```html
<ul ngListbox [(value)]="picked" [multi]="true" orientation="vertical">
  @for (breed of breeds(); track breed.id) {
    <li ngOption [value]="breed.id" [label]="breed.name" [disabled]="breed.disabled">
      {{ breed.name }}
    </li>
  }
</ul>
```

`value` is a `model()` of an array, even in single-select mode. Useful inputs:

| Input           | Values                        | Effect                                                   |
| --------------- | ----------------------------- | -------------------------------------------------------- |
| `multi`         | boolean                       | multiple selection, sets `aria-multiselectable`           |
| `focusMode`     | `roving` / `activedescendant` | where DOM focus actually sits                             |
| `selectionMode` | `follow` / `explicit`         | whether moving the active item also selects it            |
| `softDisabled`  | boolean                       | whether disabled options are still focusable              |
| `wrap`          | boolean                       | whether arrow navigation wraps around                     |
| `typeaheadDelay`| number                        | how long letter typeahead accumulates                     |

`label` is what typeahead searches, so give it the visible text when the option renders more than a
single string.

## Why this instead of hand-rolled ARIA

The keyboard contract for a tab list or a listbox is long: Home, End, arrow wrapping, typeahead
reset, skipping disabled items, activedescendant bookkeeping. `@angular/aria` implements it once and
keeps it in sync with the WAI-ARIA authoring practices, which is exactly the part that rots in an
application codebase.
