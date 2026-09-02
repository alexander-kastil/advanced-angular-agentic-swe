Examine the cross-field validation in `signal-form-validation-intro.component.ts`:

```typescript
registerModel = signal({ email: "", password: "", passwordRepeat: "" });

registerForm = form(this.registerModel, (s) => {
  required(s.email, { message: "Email is required" });
  email(s.email, { message: "Invalid email" });
  required(s.password, { message: "Password is required" });
  minLength(s.password, 4, { message: "Min 4 characters" });
  required(s.passwordRepeat, { message: "Please repeat password" });
  validate(s.passwordRepeat, ({ value, valueOf }) => (value() !== valueOf(s.password) ? { kind: "mismatch", message: "Passwords do not match" } : null));
});
```

Use `validate()` with `valueOf()` for cross-field checks.
