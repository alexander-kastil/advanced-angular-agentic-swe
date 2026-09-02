The same profile form, built twice. The left card is `ReactiveFormsModule`, the right card is Signal Forms. Both enforce the same four rules: a display name of at least three characters, a password of at least eight, a required confirmation, and the two passwords matching.

## Structure

```typescript
readonly reactiveProfile = new FormGroup(
  {
    displayName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    confirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  },
  { validators: (g) => (g.value.password === g.value.confirmation ? null : { mismatch: true }) },
);
```

```typescript
readonly model = signal<ProfileModel>({ displayName: '', password: '', confirmation: '' });

readonly signalProfile = form(this.model, (s) => {
  required(s.displayName, { message: 'Display name is required' });
  minLength(s.displayName, 3, { message: 'At least 3 characters' });
  required(s.password, { message: 'Password is required' });
  minLength(s.password, 8, { message: 'At least 8 characters' });
  required(s.confirmation, { message: 'Confirm the password' });
  validate(s.confirmation, ({ value, valueOf }) =>
    value() === valueOf(s.password) ? null : { kind: 'mismatch', message: 'Passwords do not match' },
  );
});
```

The shape of the data moved out of the form and into an interface. The form is now a set of rules over a signal you already own.

## The mapping

| ReactiveFormsModule | Signal Forms |
|---|---|
| `new FormGroup({...})` | `form(model, schema)` |
| `new FormControl('')` | a property on the model interface |
| `Validators.required` | `required(path, { message })` |
| `Validators.minLength(3)` | `minLength(path, 3, { message })` |
| group-level validator | `validate()` on the field that shows the error |
| `formControlName="x"` | `[formField]="myForm.x"` |
| `control.hasError('required')` | `field().getError('required')` |
| `control.errors` | `field().errors()` |
| `form.valueChanges` + `toSignal` | the model signal itself |
| `markAllAsTouched()` then `if (valid)` | `submit(myForm, action)` |
| `[formGroup]` on the `<form>` | nothing, or `[formRoot]` for submission options |

## Steps

1. Replace the `FormGroup` shape with a plain interface and a `signal()` holding it.
2. Swap `new FormGroup({...})` for `form(model, schema)`.
3. Move each `Validators.x` into the schema.
4. Turn group-level validators into `validate()` on the field that should display the error, reading siblings with `valueOf()`. This is usually an improvement: a group error has no natural place to render, a field error does.
5. Replace `formControlName="x"` with `[formField]="myForm.x"` and drop `[formGroup]`.
6. Replace `hasError()` calls with `errors()` or `getError()`.
7. Replace `markAllAsTouched()` plus a validity check with `submit()`.
8. Delete `valueChanges` subscriptions and their `toSignal()` bridges.
9. Remove `ReactiveFormsModule` from the component imports.

## Why the left card still needs toSignal

The app is zoneless, so a template that reads `reactiveProfile.value` directly would not refresh reliably. The reactive card bridges its observables once:

```typescript
readonly reactiveValue = toSignal(this.reactiveProfile.valueChanges, { initialValue: this.reactiveProfile.value });
readonly reactiveStatus = toSignal(this.reactiveProfile.statusChanges, { initialValue: this.reactiveProfile.status });
```

The Signal Forms card needs no such bridge, because `model()` and every `field()` accessor are already signals. That deleted bridge is the concrete payoff of the migration.

## Migrating in place

`@angular/forms/signals` also ships an interop layer (`CompatFieldState`, `SchemaPath` over an `AbstractControl`) for wrapping an existing `FormGroup` in a field tree while a large form is converted piece by piece. Prefer the clean rewrite for small forms; reach for interop when a form is too large to convert in one commit.
