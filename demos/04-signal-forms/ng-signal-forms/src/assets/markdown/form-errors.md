Examine the error collection in `signal-form-errors.component.ts`:

```typescript
skillForm = form(this.skillModel, (s) => {
  required(s.name, { message: "Name is required" });
  minLength(s.name, 4, { message: "Min 4 characters" });
  maxLength(s.name, 15, { message: "Max 15 characters" });
  validate(s.name, ({ value }) => (value() === "Hugo" ? { kind: "invalidName", message: "Hugo is not allowed" } : null));
  required(s.age, { message: "Age is required" });
  min(s.age, 18, { message: "Must be 18+" });
  applyEach(s.skills, (item) => {
    required(item.skillName, { message: "Skill name required" });
    required(item.years, { message: "Years required" });
  });
});

allErrors = computed(() => [...this.skillForm.name().errors(), ...this.skillForm.age().errors()]);
```

Aggregate errors across fields using `computed()`.
