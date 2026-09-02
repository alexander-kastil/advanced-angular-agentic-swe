Examine the submit handler in `signal-form-submit.component.ts`:

```typescript
loginForm = form(this.model, (s) => {
  required(s.email, { message: 'Email is required' });
  email(s.email, { message: 'Invalid email address' });
  required(s.password, { message: 'Password is required' });
  minLength(s.password, 6, {
    message: 'Password must be at least 6 characters',
  });
});

login(): void {
  submit(this.loginForm, async () => {
    this.submitted.set(true);
    console.log('Login with:', this.model());
  });
}
```

`submit()` marks all fields as touched and calls the callback only when valid.
