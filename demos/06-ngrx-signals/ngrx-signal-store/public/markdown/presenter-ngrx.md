A `Container-Presenter` pattern separates data management from presentation. Examine `skills-container` (container) and `skill-row` (presenter).

`skills-container.component.html` — iterates the signal-based collection:

```html
@for (sk of skills() ; track sk) {
  <app-skill-row [skill]="sk"
    (itemDeleted)="deleteItem($event)"
    (itemCompleted)="toggleItemComplete($event)"
   />
}
```

`skill-row.component.ts` — uses signal-based `input()` and `output()`:

```typescript
export class SkillRowComponent {
  skill = input.required<Skill>();
  itemDeleted = output<Skill>();
  itemCompleted = output<Skill>();
```