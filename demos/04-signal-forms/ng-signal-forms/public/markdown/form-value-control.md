`[formField]` binds to native inputs out of the box. To bind it to your own component, implement the `FormValueControl<T>` contract from `@angular/forms/signals`.

## The contract

Only one member is required:

```typescript
export class RatingInputComponent implements FormValueControl<number> {
  readonly value = model.required<number>();
}
```

Everything else is optional, and whatever you declare the `FormField` directive keeps in sync for you:

| Member | Direction | Meaning |
|---|---|---|
| `value` | two-way | the model value, a `model()` signal |
| `errors` | in | the field's validation errors |
| `disabled` | in | mirrors `disabled()` from the schema |
| `readonly` | in | mirrors `readonly()` |
| `hidden` | in | mirrors `hidden()` |
| `invalid`, `pending`, `touched` | in | field status |
| `touch` | out | emit it to call `markAsTouched()` on the field |

A control that edits a boolean implements `FormCheckboxControl` instead, which requires `checked` and forbids `value`.

## Marking the field touched

There is no `touched` model. The directive listens for an output literally named `touch`:

```typescript
readonly touch = output<void>();
```

Emit it on blur, or whenever the user commits a value. In the rating control both happen: clicking a star sets the value and emits `touch`.

## Do not fight the schema

The rating control accepts a `disabled` input, but the demo never binds it in the template. Disabling is a schema decision:

```typescript
disabled(s.rating, () => this.lockRating());
```

The directive then pushes that into the control's `disabled` input. Binding `[disabled]` yourself would be overwritten on the next change detection pass.

## Raw value versus model value: transformedValue

`MoneyInputComponent` edits a `number | null` but shows a string. `transformedValue()` builds a writable signal for the raw representation and reports parse failures as validation errors:

```typescript
protected readonly rawValue = transformedValue(this.value, {
  parse: (raw: string) => {
    const trimmed = raw.trim().replace(/[^0-9.,-]/g, '').replace(',', '.');
    if (trimmed === '') {
      return { value: null };
    }
    const parsed = Number(trimmed);
    return Number.isNaN(parsed)
      ? { error: { kind: 'money', message: `"${raw}" is not an amount` } }
      : { value: parsed };
  },
  format: (value: number | null) => (value === null ? '' : value.toFixed(2)),
});
```

`parse` may return a value, an error, or both. Omitting `value` leaves the model untouched, which is how a half-typed entry avoids clobbering good data. Read the failures through `rawValue.parseErrors()`; inside a field context they are reported to the field as well.
