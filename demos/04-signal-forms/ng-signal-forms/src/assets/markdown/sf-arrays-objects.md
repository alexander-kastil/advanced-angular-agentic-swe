Examine the `schema()` reusable validation in `signal-form-arrays-objects.component.ts`:

```typescript
const visitSchema = schema<VetVisit>((path) => {
  required(path.vetName, { message: "Vet name is required" });
  required(path.reason, {
    message: "Reason is required when vet is entered",
    when: (ctx) => Boolean(ctx.valueOf(path.vetName)),
  });
  min(path.year, 2000, { message: "Year must be 2000 or later" });
  max(path.year, new Date().getFullYear(), {
    message: "Year cannot be in the future",
  });
  pattern(path.year, /^\d{4}$/, {
    message: "Year must be four digits (YYYY)",
  });
});

petForm = form(this.petModel, (s) => {
  required(s.petName, { message: "Pet name is required" });
  applyEach(s.vetVisits, visitSchema);
});
```

Use `schema()` to define reusable validation rules for array items.
