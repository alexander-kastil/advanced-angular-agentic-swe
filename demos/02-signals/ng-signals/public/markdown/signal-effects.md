- Examine `signal-effects.component.ts` to see how signals trigger reactive updates in `httpResource()`

- Use a signal to hold filter state — change the signal, automatically refetch data:

```typescript
completedFilter = signal<boolean | undefined>(undefined);

skillsResource = httpResource<Skill[]>(
  () => {
    const filter = this.completedFilter();
    return filter !== undefined ? `${environment.api}skills?completed=${filter}` : undefined;
  },
  { defaultValue: [] },
);
```

- When `completedFilter.set(true)` is called, `httpResource()` **automatically re-executes** because it depends on the signal
- **No explicit `effect()`** needed — signal reactivity is built into `httpResource()`

- Use the signal to drive user selections:

```typescript
onStatusChange(event: MatSelectChange) {
  this.completedFilter.set(event.value);
}
```

- Display filtered results in the template:

```html
@for (skill of skillsResource.value(); track $index) {
<div>{{ skill.name }}</div>
}
```

- **Key insight:** Signals make data loading reactive without manual subscribe/unsubscribe patterns. Change the filter signal → URL updates → data re-fetches automatically
