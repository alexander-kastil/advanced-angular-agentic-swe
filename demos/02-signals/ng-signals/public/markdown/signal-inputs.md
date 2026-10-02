- Examine `skill-row.component.ts` and its use of Signal inputs and outputs that replaces classic `@Input()` and `@Output()` decorators.

- `input` can be required or optional. If optional it can be set to a default value using `x = input<number>(0);`

```typescript
export class SkillRowComponent {
  skill = input.required<Skill>();
  editEnabled = input(false, { transform: (v) => v === 'true' ? true : false });
  itemDeleted = output<Skill>();
  itemCompleted = output<Skill>();

  deleteItem(item: Skill): void {
    this.itemDeleted.emit(item);
  }
}
```

- An input is a read-only signal, so anything derived from it is a `computed()`. There is no
  `ngOnChanges` and no setter: the derived value follows the input on its own.

```typescript
skill = input.required<Skill>();
label = computed(() => (this.skill().completed ? `${this.skill().name} (done)` : this.skill().name));
```

- `transform` converts the bound value before the component sees it. For boolean flags, the
  built-in `booleanAttribute` from `@angular/core` replaces a hand-written transform, so
  `<app-skill-row editEnabled />` and `[editEnabled]="true"` both read as `true`.

| Declaration | Template binding | Read in the class |
| --- | --- | --- |
| `input.required<Skill>()` | `[skill]="s"` must be bound | `this.skill()` |
| `input(false)` | optional, default `false` | `this.editEnabled()` |
| `output<Skill>()` | `(itemDeleted)="remove($event)"` | `this.itemDeleted.emit(s)` |
