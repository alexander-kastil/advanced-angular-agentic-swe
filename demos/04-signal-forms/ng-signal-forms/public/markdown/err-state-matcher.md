`ErrorStateMatcher` decides *when* Angular Material renders `<mat-error>`. With Signal Forms the matcher implements `isSignalErrorState(field)` instead of `isErrorState(control, form)`:

```typescript
export class DirtyOnlyStateMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!control && control.invalid && control.dirty;
  }

  isSignalErrorState(field: Field<unknown> | null): boolean {
    if (!field) {
      return false;
    }
    const state = field();
    return state.invalid() && state.dirty();
  }
}
```

Register it per control:

```html
<input matInput [formField]="registerForm.password" [errorStateMatcher]="eager" />
```

Or for the whole component / application:

```typescript
providers: [{ provide: ErrorStateMatcher, useClass: DirtyOnlyStateMatcher }]
```

`Field<unknown>` is `() => FieldState<unknown>`, so the matcher reads the same `invalid()`, `dirty()`, `touched()` signals the template uses.
