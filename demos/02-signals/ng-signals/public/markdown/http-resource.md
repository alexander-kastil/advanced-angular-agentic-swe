- `httpResource()` is Angular 19+'s signal-based HTTP primitive — it replaces `Observable` + `toSignal()` + manual loading/error state

```typescript
skillsResource = httpResource<Skill[]>(() => `${environment.api}skills`);
```

- The request function is reactive — the resource refetches automatically when any signal read inside it changes

- Returning `undefined` from the request function puts the resource in **idle** state — no request is sent

- Built-in reactive state exposed as signals — no `async` pipe or `ChangeDetectorRef` needed:
    - `skillsResource.value()` — latest response body
    - `skillsResource.isLoading()` — `true` while in-flight
    - `skillsResource.error()` — error from last failed request
    - `skillsResource.status()` — `Idle` · `Loading` · `Resolved` · `Error`

- `httpResource.update()` applies an immutable local transform without a network round-trip — same API as `signal.update()`

- Note: `navbar.service.ts` and `PersonService` were removed after their only consumers migrated to `httpResource` directly
