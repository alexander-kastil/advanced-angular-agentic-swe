Examine the pet CRUD form in `signal-form-pets.component.ts`:

```typescript
petForm = form(this.petModel, (s) => {
  required(s.name, { message: 'Pet name is required' });
  required(s.age, { message: 'Age is required' });
  min(s.age, 0, { message: 'Age cannot be negative' });
  max(s.age, 30, { message: 'Age must be 30 or less' });
  required(s.breed, { message: 'Breed is required' });
  required(s.owner, { message: 'Owner is required' });
});

savePet(): void {
  submit(this.petForm, async () => {
    this.submitted.set(true);
    const updated = this.petModel();
    this.selectedPet.set({ ...updated });
    this.petService.reload();
  });
}
```

Uses `rxResource` to fetch pets, `effect()` for on-change tracking, and `submit()` for save.
