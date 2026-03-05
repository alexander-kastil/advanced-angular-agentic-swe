Examine the conditional validators in `signal-form-when.component.ts`:

```typescript
petForm = form(this.petModel, (s) => {
  required(s.name, { message: "Pet name is required" });

  required(s.allergyDetails, {
    message: "Allergy details are required when pet has allergies",
    when: ({ valueOf }) => valueOf(s.hasAllergies) === true,
  });

  applyWhen(
    s.leashColor,
    ({ valueOf }) => valueOf(s.isOutdoor) === true,
    (leashPath) => {
      required(leashPath, {
        message: "Leash color is required for outdoor pets",
      });
    },
  );
});
```

Use `when` option on validators or `applyWhen()` for conditional validation blocks.
