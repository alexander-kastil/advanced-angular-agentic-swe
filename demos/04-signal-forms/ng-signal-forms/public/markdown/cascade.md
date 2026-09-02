Cascading dropdowns derive the options of a second control from the value of a first one. In `cascade.component.ts` every skill row is an item of a form array:

```typescript
profileForm = form(this.profileModel, (s) => {
  required(s.firstName, { message: "First name is required" });
  required(s.lastName, { message: "Last name is required" });

  applyEach(s.skills, (skill) => {
    required(skill.techType, { message: "Pick a category" });
    disabled(skill.techValues, ({ valueOf }) => !valueOf(skill.techType));
    required(skill.techValues, {
      message: "Pick a technology",
      when: ({ valueOf }) => !!valueOf(skill.techType),
    });
  });
});
```

- `applyEach()` applies the same schema to every array item
- `disabled()` keeps the dependent control locked until the parent has a value
- `when` activates the second `required()` only once a category is chosen
- selecting a new category clears the stale child value via `techValues().value.set("")`
