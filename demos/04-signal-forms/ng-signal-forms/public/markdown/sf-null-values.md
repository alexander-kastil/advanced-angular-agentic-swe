Signal Forms bind directly to the model, so `null` and `undefined` leak straight into the controls. Keep a separate **form model** with plain values and map it to the **domain model** on save.

```typescript
interface PetDomain {
  petName: string;
  breed: string;
  notes: string | null;
  weight: number | null;
  microchipId?: string;
  adoptionDate: Date | null;
}

interface PetFormModel {
  petName: string;
  breed: string;
  notes: string;
  weight: number;
  microchipId: string;
  adoptionDate: Date | null;
}
```

`Date | null` is the exception: `<input type="date">` needs it. An optional domain property (`microchipId?`) becomes a required empty string in the form model.

`applyWhenValue()` guards validators so they only run once a value is actually present:

```typescript
petForm = form(this.petModel, (s) => {
  required(s.petName, { message: "Pet name is required" });
  required(s.breed, { message: "Breed is required" });
  min(s.weight, 0, { message: "Weight cannot be negative" });

  applyWhenValue(
    s.notes,
    (value) => value !== null && value !== "",
    (notesPath) => minLength(notesPath, 5, { message: "Notes must be at least 5 characters" }),
  );

  applyWhenValue(
    s.microchipId,
    (value) => value !== "",
    (chipPath) => minLength(chipPath, 10, { message: "Microchip ID must be at least 10 characters" }),
  );
});
```

Press **Save** to see the mapped domain model, where the empty strings become `null` and `undefined` again.
