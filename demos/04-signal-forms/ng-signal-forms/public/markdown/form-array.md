Examine the signal form array in `signal-form-array.component.ts`:

```typescript
skillModel = signal<SkillsModel>({
  name: "Giro",
  skills: [{ skill: "Hunting", years: "9" }],
});

skillForm = form(this.skillModel, (s) => {
  required(s.name, { message: "Name is required" });
  applyEach(s.skills, (item) => {
    required(item.skill, { message: "Skill name required" });
    required(item.years, { message: "Years required" });
  });
});
```
