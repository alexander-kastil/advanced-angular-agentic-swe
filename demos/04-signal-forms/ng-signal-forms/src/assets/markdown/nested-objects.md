Examine the nested objects signal form in `signal-form-nested-objects.component.ts`:

```typescript
personModel = signal<NestedModel>({
  name: "",
  lastName: "",
  age: 0,
  gender: "not set",
  email: "",
  wealth: "",
  address: { street: "", city: "", postalCode: "" },
});

// Signal Forms supports nested objects via dot notation
personForm = form(this.personModel, (s) => {
  required(s.name, { message: "Name is required" });
  required(s.lastName, { message: "Last name is required" });
  required(s.address.street, { message: "Street is required" });
});
```
