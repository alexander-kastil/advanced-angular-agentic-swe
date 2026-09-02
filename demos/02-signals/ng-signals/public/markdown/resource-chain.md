- A resource whose request depends on **another resource's value** used to force a manual dance:
  read the parent value, check for `undefined`, return `undefined` to keep the child idle, and hope
  the statuses line up. Angular 22 replaces that with the `chain()` operator.

- `chain()` is handed to the `params` (or url) function of every resource through the
  `ResourceParamsContext`, so you destructure it from the argument instead of importing it:

```typescript
readonly skills = httpResource<Skill[]>(() => `${environment.api}skills`, {
  defaultValue: [],
});

readonly selected = httpResource<Skill>(
  ({ chain }) => {
    const list = chain(this.skills);
    return `${environment.api}skills/${list[this.index() % list.length].id}`;
  },
  { defaultValue: { id: 0, name: '', completed: false } },
);
```

- Inside the params function, `chain(other)` either **returns the resolved value** or **throws a
  status marker** that the current resource turns into its own status:

| Dependency status | What `chain()` does | Status of the chained resource |
| --- | --- | --- |
| `resolved` / `local` | returns the value | continues, request is built |
| `loading` / `reloading` | throws `ResourceParamsStatus.LOADING` | `loading` |
| `idle` | throws `ResourceParamsStatus.IDLE` | `idle` |
| `error` | throws `ResourceDependencyError` | `error`, carrying the failing dependency |

- Chains compose: the third resource in this demo chains off the second, which chains off the first.
  Press **Reload root** and watch all three statuses walk back to `loading` in order.

- No `if (!value) return undefined` and no `?.` anywhere in the params function. That is the point:
  the shape of the request stays the shape of the data, and status propagation is the framework's job.

- Errors are not swallowed. A failing dependency surfaces as a `ResourceDependencyError` on the
  chained resource, with a `dependency` property pointing at the resource that actually failed.

- The chain is fully reactive. Changing `index()` re-runs only the params functions that read it,
  and every downstream resource re-requests in order.

> The demo talks to `http://localhost:3000/skills`. Run `json-server db.json` in the app folder to
> see live data.
