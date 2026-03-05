Examine the signal form without a builder in `signal-form-builder.component.ts`:

```typescript
personModel = signal({
  id: 0,
  name: "",
  age: 0,
  email: "",
  gender: "not set" as "male" | "female" | "not set",
  wealth: "",
});

personForm = form(this.personModel, (s) => {
  required(s.name, { message: "Name is required" });
  min(s.age, 1, { message: "Age must be at least 1" });
  email(s.email, { message: "Invalid email" });
  validate(s.gender, ({ value }) => (this.genderPattern.test(value()) ? null : { kind: "pattern", message: "Invalid gender" }));
});
```
