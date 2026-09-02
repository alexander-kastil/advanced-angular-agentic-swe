`minDate()` and `maxDate()` are the `Date` counterparts of `min()` and `max()`. They apply to a `Date | null` field and produce typed errors that carry the bound that was violated.

```typescript
minDate(s.departure, BOOKING_OPENS, { message: 'Bookings do not open before today' });
maxDate(s.departure, BOOKING_CLOSES, { message: 'Bookings close 180 days out' });
```

## A bound derived from another field

The second argument accepts a `LogicFn` as well as a literal `Date`, so one field's bound can come from a sibling:

```typescript
minDate(s.arrival, ({ valueOf }) => valueOf(s.departure) ?? undefined, {
  message: 'Arrival cannot be before departure',
});
```

Returning `undefined` switches the validator off, which is what happens while departure is still empty.

## Binding a Date to a native input

`<input type="date">` works directly:

```html
<input class="input" type="date" [formField]="tripForm.departure" />
```

When the model value is `null` or a `Date`, Signal Forms reads `element.valueAsDate` and writes `element.valueAsDate`, so no string parsing is needed on your side. Angular also mirrors the validator bounds onto the element's own `min` and `max` attributes, formatted for the input type, so the browser's date picker greys out the disallowed range.

## Reading errors with getError

`errors()` gives the whole list. `getError(kind)` picks one out and narrows its type:

```typescript
readonly departureMinError = computed(() => this.tripForm.departure().getError('minDate'));
readonly arrivalTooLong = computed(() => this.tripForm.arrival().getError('tooLong'));
```

For a built-in kind the result is the matching `NgValidationError` subclass, so `departureMinError()!.minDate` is a `Date`, not `unknown`. The kinds and their payloads:

| Kind | Error class | Extra property |
|---|---|---|
| `required` | `RequiredValidationError` | none |
| `min` / `max` | `MinValidationError` / `MaxValidationError` | `min` / `max` (number) |
| `minDate` / `maxDate` | `MinDateValidationError` / `MaxDateValidationError` | `minDate` / `maxDate` (Date) |
| `minLength` / `maxLength` | `MinLengthValidationError` / `MaxLengthValidationError` | `minLength` / `maxLength` |
| `pattern` | `PatternValidationError` | `pattern` |
| `email` | `EmailValidationError` | none |

Passing a custom kind string uses the second overload and returns the generic `ValidationError.WithFieldTree`, which is how `getError('tooLong')` reaches the trip-length rule declared with `validate()`.

`getError()` is reactive: called inside a `computed()` or `effect()` it re-runs when the field's errors change.
