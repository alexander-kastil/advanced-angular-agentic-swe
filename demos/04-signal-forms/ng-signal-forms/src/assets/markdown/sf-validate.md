Examine the cross-field validation in `signal-form-validate.component.ts`:

```typescript
adoptionForm = form(this.adoptionModel, (s) => {
  required(s.petName, { message: "Pet name is required" });
  required(s.age, { message: "Age is required" });
  min(s.age, 0, { message: "Age cannot be negative" });
  max(s.age, 30, { message: "Age must be 30 or less" });

  validate(s.wantsInsurance, (ctx) => {
    const insurance = ctx.value();
    const training = ctx.valueOf(s.wantsTraining);
    return checkService(insurance, training);
  });

  validate(s.contactEmail, (ctx) => {
    const email = ctx.value();
    const phone = ctx.valueOf(s.contactPhone);
    if (!email && !phone) {
      return { kind: "contactMissing", message: "Provide either email or phone" };
    }
    return null;
  });
});
```

Use `validate()` with `ctx.valueOf()` to read sibling field values for cross-field rules.
