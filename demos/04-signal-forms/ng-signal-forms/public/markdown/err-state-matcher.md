An error-state matcher decides *when* a form renders its error text. With Signal Forms the matcher implements `isSignalErrorState(field)` alongside the classic `isErrorState(control, form)`:

```typescript
export class DirtyOnlyStateMatcher implements FieldErrorStateMatcher {
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!control && control.invalid && control.dirty;
  }

  isSignalErrorState<T>(field: Field<T> | null): boolean {
    if (!field) {
      return false;
    }
    const state = field();
    return state.invalid() && state.dirty();
  }
}
```

Ask it per control in the template:

```html
<input class="input" type="password" [formField]="registerForm.password" />
@if (eager.isSignalErrorState(registerForm.password)) {
  <div class="error">At least 4 characters</div>
}
```

One matcher instance can be shared across every field of a component, or provided through DI when the whole application should use the same rule.

`Field<T>` is `() => FieldState<T>`, so the matcher reads the same `invalid()`, `dirty()`, `touched()` signals the template uses.
