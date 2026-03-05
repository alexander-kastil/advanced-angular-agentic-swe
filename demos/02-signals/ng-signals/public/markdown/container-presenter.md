- Examine `container-presenter-signals.component.ts` — the **container** owns state and data, the **presenter** components only receive inputs and emit outputs

- Data is loaded with `httpResource` and passed directly to the list presenter — no `async` pipe, no manual signal needed:

```typescript
personsResource = httpResource<Person[]>(() => `${environment.api}persons`, { defaultValue: [] });
```

- `personsResource.update()` applies an immutable local update without a second HTTP call — same API as `signal.update()`:

```typescript
this.personsResource.update(persons =>
  persons.map(i => i.id === p.id ? { ...i, ...p } : i)
);
```

- The selected person is tracked with a plain `signal` — the edit form appears via `@if (current())`
