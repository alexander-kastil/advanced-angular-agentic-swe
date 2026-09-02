# Test a Signal Form

Signal Forms are stable in Angular 22. A form is a `FieldTree` built from a `WritableSignal` model, and every piece of its state is a signal. That makes it the easiest thing in the framework to test: no DOM, no `ControlValueAccessor`, no `whenStable`.

## The form under test

```typescript
readonly model = signal<Signup>({ email: '', password: '', confirm: '', age: 0 });

readonly signupForm = form(this.model, (path) => {
  required(path.email, { message: 'Email is required' });
  emailRule(path.email, { message: 'Enter a valid email' });
  required(path.password, { message: 'Password is required' });
  minLength(path.password, 8, { message: 'Password needs 8 characters' });
  validate(path.confirm, ({ value, valueOf }) =>
    value() === valueOf(path.password) ? null : { kind: 'mismatch', message: 'Passwords do not match' }
  );
  min(path.age, 18, { message: 'You must be 18 or older' });
});
```

`email` is imported as `emailRule` only because the model has a field called `email`. Both names are fine; pick one and stay with it.

## Setting a value

Call the field, then write its `value` signal. This goes through the form, so the model signal updates too.

```typescript
component.signupForm.email().value.set('ada@demo.io');

expect(component.model().email).toBe('ada@demo.io');
```

No `fixture.detectChanges()`. Validation is `computed()`, so the error state is correct on the next read.

## Asserting validation state

Every field exposes `valid()`, `invalid()`, `touched()`, `dirty()`, `errors()` and `errorSummary()`.

```typescript
it('replaces the required error with the format error once a value is typed', () => {
  component.signupForm.email().value.set('not-an-email');

  const messages = component.signupForm.email().errors().map((e) => e.message);
  expect(messages).toContain('Enter a valid email');
  expect(messages).not.toContain('Email is required');
});
```

Assert on `errors()` mapped to messages rather than on `invalid()` alone. `invalid()` tells you something is wrong; the message tells you it is the *right* something. A cross-field rule is read from the field it was declared on:

```typescript
component.signupForm.password().value.set('supersecret');
component.signupForm.confirm().value.set('supersecrez');

expect(component.signupForm.confirm().errors().map((e) => e.message)).toContain('Passwords do not match');
```

`errorSummary()` on the root collects every error in the tree, which is what the template renders.

## Submission

`submit()` marks the whole tree touched, runs `action` only when the form is valid, and resolves to a boolean.

```typescript
register(): Promise<boolean> {
  this.attempts.update((n) => n + 1);
  return submit(this.signupForm, {
    action: async () => {
      const result = await this.signups.register(this.model());
      if (result === 'email-taken') {
        return [{ fieldTree: this.signupForm.email, kind: 'server', message: 'Email already registered' }];
      }
      this.accepted.set(this.model());
      return undefined;
    },
    onInvalid: () => this.invalidAttempts.update((n) => n + 1),
  });
}
```

Returning the promise from the component method is the whole trick that makes it testable. Three things are worth asserting:

```typescript
it('does not run the action when the form is invalid', async () => {
  const submitted = await component.register();

  expect(submitted).toBe(false);
  expect(component.invalidAttempts()).toBe(1);
  expect(signups.accepted.length).toBe(0);
});

it('marks every field touched on an invalid submit', async () => {
  await component.register();

  expect(component.signupForm().touched()).toBe(true);
  expect(component.signupForm.email().touched()).toBe(true);
});

it('binds a server error returned by the action onto the email field', async () => {
  fillValid('taken@demo.io');
  await component.register();

  expect(component.signupForm.email().errors().map((e) => e.message)).toContain('Email already registered');
});
```

That last one is the reason to return errors from `action` instead of setting your own signal: a server rejection lands on the field it belongs to and renders through the same error path as a client-side rule.

## What still needs the DOM

Almost nothing. Render the component when you want to check that the errors reach the screen:

```typescript
const errors = fixture.nativeElement.querySelectorAll('[data-testid="error"]');
expect(errors.length).toBeGreaterThan(0);
```

Everything else, including submission, is faster and clearer against the `FieldTree` directly.
