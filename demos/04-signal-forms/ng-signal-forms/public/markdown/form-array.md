Examine the signal form array in `form-array.component.ts`:

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

## Add and remove items through the model

Rows are added and removed on the model, not on the field tree. The model signal is the source of truth, so adding or removing a row is an immutable update of the array, and the field tree follows:

```typescript
addSkill() {
  this.skillModel.update((m) => ({ ...m, skills: [...m.skills, { skill: '', years: '' }] }));
}

removeSkill(index: number) {
  this.skillModel.update((m) => ({ ...m, skills: m.skills.filter((_, i) => i !== index) }));
}
```

`applyEach()` attaches the item rules to every row, including rows added later. The template iterates the field tree, not the model, so each row binds its own fields:

```html
@for (item of skillForm.skills; track $index; let i = $index) {
  <input [formField]="item.skill" />
  <input [formField]="item.years" />
  <button type="button" (click)="removeSkill(i)">Remove</button>
}
```
