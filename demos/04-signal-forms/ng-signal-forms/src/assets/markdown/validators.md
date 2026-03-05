Examine the sync and async validators in `signal-form-validators.component.ts`:

```typescript
personForm = form(this.personModel, (s) => {
  required(s.name, { message: "Name is required" });
  validate(s.name, ({ value }) => (value() === "Hugo" ? { kind: "invalidName", message: "The name Hugo is not allowed" } : null));
  min(s.age, 18, { message: "Person must be at least 18" });
  max(s.age, 99, { message: "Person must be at most 99" });
  required(s.email, { message: "Email is required" });
  email(s.email, { message: "Invalid email address" });
  validateAsync(s.email, {
    params: ({ value }) => value() ?? undefined,
    factory: this.createEmailResource,
    onSuccess: (exists) => (exists ? { kind: "mailExists", message: "Sorry this mail is already registered" } : null),
    onError: () => ({
      kind: "serverError",
      message: "Could not verify email",
    }),
  });
});
```

Use `validateAsync()` with `rxResource` for server-side validation.
