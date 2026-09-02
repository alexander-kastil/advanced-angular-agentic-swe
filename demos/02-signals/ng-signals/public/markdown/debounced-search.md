- Typing into a search box updates a signal on every keystroke. Sending one HTTP request per
  keystroke is wasteful, and the classic fix pulled in RxJS just for `debounceTime`. Angular 22
  ships `debounced()` in `@angular/core` instead.

```typescript
import { debounced, signal } from '@angular/core';

readonly term = signal('');
readonly debouncedTerm = debounced(this.term, 400);
```

- `debounced(source, wait, options?)` returns a **`Resource<T>`**, not a signal. That is deliberate:
  a debounce has states, and a resource already models them.

| Member | Meaning here |
| --- | --- |
| `value()` | the last settled term |
| `status()` | `resolved` when settled, `loading` while the timer runs |
| `isLoading()` | true while the user is still typing |
| `error()` | set if the source function itself threw |

- The first read resolves immediately with the source's current value, so there is no `undefined`
  window and no `defaultValue` to supply.

- Drive the request off the settled value, never the raw signal:

```typescript
readonly results = httpResource<Skill[]>(() => {
  const term = this.debouncedTerm.value().trim();
  return term
    ? `${environment.api}skills?name_like=${encodeURIComponent(term)}`
    : `${environment.api}skills`;
}, { defaultValue: [] });
```

- `isLoading()` on the debounced resource is the honest "still typing" indicator, and it is separate
  from `results.isLoading()`, which is the real network wait. The demo prints both.

- The `wait` argument is either a number of milliseconds or a function
  `(value, lastValue) => Promise<void> | void`. Returning `undefined` from that function settles the
  value **immediately**, which is how you implement "debounce long terms, but search short ones at
  once" or "flush on Enter".

- `debounced()` must be created in an injection context (a field initializer or a constructor),
  because it registers an internal effect. Pass `{ injector }` if you need it elsewhere.

- Combine it with `chain()` when you want the search resource to stay in `loading` for the whole
  debounce window rather than showing stale results:

```typescript
readonly results = httpResource<Skill[]>(({ chain }) =>
  `${environment.api}skills?name_like=${encodeURIComponent(chain(this.debouncedTerm))}`,
  { defaultValue: [] },
);
```

> The demo talks to `http://localhost:3000/skills`. Run `json-server db.json` in the app folder and
> type `Ang` or `Sig` to see the filter work.
