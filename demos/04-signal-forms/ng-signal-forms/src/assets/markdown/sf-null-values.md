Examine the null value handling in `signal-form-null-values.component.ts`:

```typescript
petForm = form(this.petModel, (s) => {
  required(s.petName, { message: "Pet name is required" });
  required(s.breed, { message: "Breed is required" });
  min(s.weight, 0, { message: "Weight cannot be negative" });
  applyWhenValue(
    s.notes,
    (value) => value !== null,
    (notesPath) => {
      minLength(notesPath, 5, {
        message: "Notes must be at least 5 characters",
      });
    },
  );
});
```

Use `applyWhenValue()` to guard validators so they only run when the value is non-null.
