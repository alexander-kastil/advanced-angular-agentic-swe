`@angular/aria` is Angular's headless accessibility package: directives that own roles, focus and keyboard behaviour, with no opinion about how anything looks. An autocomplete is three of them working together.

Install it alongside the other Angular packages:

```bash
npm install @angular/aria
```

## The three directives

| Directive | Selector | Role |
|---|---|---|
| `Combobox` | `[ngCombobox]` | the trigger, an editable input here; owns `value`, `expanded` and key forwarding |
| `ComboboxPopup` | `ng-template[ngComboboxPopup]` | the deferred popup content, takes the combobox as input |
| `ComboboxWidget` | `[ngComboboxWidget]` | the element inside the popup that owns the options and reports its active descendant |
| `Listbox` / `Option` | `[ngListbox]` / `[ngOption]` | selection, typeahead and arrow-key navigation inside the popup |

```html
<input
  ngCombobox
  #combobox="ngCombobox"
  [value]="originField().value()"
  (valueChange)="onQuery($event)"
  [expanded]="expanded()"
  (expandedChange)="expanded.set($event)"
  (blur)="originField().markAsTouched()"
/>

<ng-template ngComboboxPopup [combobox]="combobox">
  <div ngComboboxWidget ngListbox #listbox="ngListbox"
       [value]="selection()" (valueChange)="onPick($event)"
       [activeDescendant]="listbox.activeDescendant()">
    @for (airport of filtered(); track airport) {
      <div class="option" ngOption [value]="airport">{{ airport }}</div>
    }
  </div>
</ng-template>
```

The directives set `role`, `aria-expanded`, `aria-controls`, `aria-activedescendant` and `aria-selected` themselves, and handle ArrowUp / ArrowDown / Home / End / Escape / Enter. What you supply is the markup and the CSS.

## Wiring it to the field

`ngCombobox` exposes `value` as a `model()`, so it could be bound two-way. The demo splits it into an input and an output on purpose, because the target is not a component property but the field's own value signal:

```typescript
onQuery(value: string): void {
  this.originField().value.set(value);
}
```

The field is the single source of truth: filtering, the selection state passed to the listbox, and the validator all read `originField().value()`.

```typescript
readonly filtered = computed(() => {
  const query = this.originField().value().trim().toLowerCase();
  return query === '' ? this.airports : this.airports.filter((a) => a.toLowerCase().includes(query));
});
```

## Free text is still free text

An editable combobox lets the user type anything, so "must be one of the options" is a validation rule, not a UI guarantee:

```typescript
validate(s.origin, ({ value }) =>
  value() !== '' && !AIRPORTS.includes(value())
    ? { kind: 'unknownAirport', message: 'Pick one of the listed airports' }
    : null,
);
```

## Touched state

There is no `formField` binding on the input here, so nothing marks the field touched for you. Call it on blur:

```html
(blur)="originField().markAsTouched()"
```

Without that line the error would never appear, because the template only renders errors once `touched()` is true.
