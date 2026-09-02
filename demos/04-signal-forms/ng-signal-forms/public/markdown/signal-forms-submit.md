`submit()` is the only thing a Signal Form needs on the way out. It marks every field touched so the errors become visible, waits for pending validators, and calls the action only when the form is valid.

This demo never calls it by hand for the normal path. `[formRoot]` on the `<form>` element intercepts the browser's submit event and calls `submit()` with the options declared on the form:

```html
<form [formRoot]="loginForm" column>
  <div class="field">
    <label class="label" for="submit-email">Email</label>
    <input id="submit-email" class="input" type="email" [formField]="loginForm.email" />
  </div>

  <button class="btn btn-primary" type="submit">Login</button>
</form>
```

`FormRoot` sets `novalidate` on the element, so the browser's own bubble is out of the way. That is the whole handler: no click binding, no `event.preventDefault()`, and Enter in a text field submits the way users expect.

## Submission options

The options live on the form, in the third argument of `form()`, so the same rules apply wherever the form is submitted from:

```typescript
loginForm = form(
  this.model,
  (s) => {
    required(s.email, { message: 'Email is required' });
    email(s.email, { message: 'Invalid email address' });
    required(s.password, { message: 'Password is required' });
    minLength(s.password, 6, { message: 'Password must be at least 6 characters' });
  },
  {
    submission: {
      action: async (field) => {
        this.submitted.set(true);
        this.serverMessage.set(null);
        if (field.email().value() !== KNOWN_USER) {
          return {
            kind: 'unknownUser',
            message: 'No account for that address',
            fieldTree: field.email,
          };
        }
        return null;
      },
      onInvalid: () => this.attempts.update((count) => count + 1),
      ignoreValidators: 'pending',
    },
  },
);
```

| Option | When it runs | Notes |
|---|---|---|
| `action` | the form passed validation | `async`; returns `null` on success, or one or more errors |
| `onInvalid` | validation blocked the submit | the place for analytics, focus handling or a counter |
| `ignoreValidators` | always | `'pending'` (default), `'none'`, `'all'` |

`ignoreValidators` decides what blocks a submit:

- `'pending'`: invalid fields block, still-running async validators do not.
- `'none'`: everything must be settled and passing.
- `'all'`: submit regardless, useful for a "save draft" button.

## Returning server errors from the action

The action's return type is `TreeValidationResult`, so a failing server call attaches errors to the exact field that caused them:

```typescript
return { kind: 'unknownUser', message: 'No account for that address', fieldTree: field.email };
```

The property is `fieldTree`, not `field`. The error then appears in `loginForm.email().errors()` like any schema error, and clears on the next submit. Sign in as `cleothewhippet@integrations.at` to see the happy path instead.

## Per-call options: the escape hatch

`submit()` still exists as a direct call, and options passed to it override the form's own for that one call. The demo's second button is deliberately outside the `<form>` and calls it by hand, because it wants different rules than the ones the form declares:

```typescript
loginIgnoringValidation(): void {
  submit(this.loginForm, {
    action: async () => {
      this.serverMessage.set('Forced submit: validators were ignored');
      return null;
    },
    ignoreValidators: 'all',
  });
}
```

Reach for this when one button genuinely means something different from the form's normal submit: a "save draft" that must not be blocked, or a debug path. Everything else belongs in the `submission` block, where `[formRoot]` picks it up for free.

While an action is in flight `loginForm().submitting()` is true, which is what a disabled button or a spinner should read.
