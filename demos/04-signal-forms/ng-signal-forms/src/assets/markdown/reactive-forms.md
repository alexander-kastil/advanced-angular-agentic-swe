Examine the base signal form in `signal-form-base.component.ts`:

```typescript
personModel = signal({
  name: "",
  lastName: "",
  age: 0,
  email: "",
  gender: "not set" as "male" | "female" | "not set",
  wealth: "",
});

personForm = form(this.personModel, (s) => {
  required(s.name, { message: "Name is required" });
  minLength(s.name, 3, { message: "Min 3 characters" });
  required(s.lastName, { message: "Last name is required" });
  required(s.email, { message: "Email is required" });
  email(s.email, { message: "Invalid email" });
});
```
