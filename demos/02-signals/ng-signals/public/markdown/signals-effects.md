- Examine `signal-effects.component.ts` and notice that `effect()` + `.subscribe()` has been replaced with `httpResource()` — a signal-based HTTP primitive from Angular 19+

- The request function is reactive: returning `undefined` puts the resource in **idle** state (no request sent)

```typescript
skillsResource = httpResource<Skill[]>(() => {
  const filter = this.completedFilter();
  return filter !== undefined
    ? `${environment.api}skills?completed=${filter}`
    : undefined;
}, { defaultValue: [] });
```

- The resource refetches automatically whenever `completedFilter()` changes — no manual `effect()` needed

- Use `effect()` only for side effects that are **not** HTTP calls: logging, localStorage, DOM manipulation

