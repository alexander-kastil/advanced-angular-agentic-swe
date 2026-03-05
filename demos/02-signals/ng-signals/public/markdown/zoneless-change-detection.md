- Zoneless change detection removes `zone.js` from the pipeline — Angular relies on **signals** to know when to update the DOM

- Examine the template: the `setInterval` counter won't update live because it doesn't go through a signal — no zone means no automatic cycle

- HTTP data loaded via `httpResource` **does** update the DOM because `skillsResource.value()` is a signal:

```typescript
skillsResource = httpResource<Skill[]>(() => `${environment.api}skills`);
skills = computed(() => (this.skillsResource.value() ?? []).slice(0, 2));
```

- `httpResource` replaces the `toSignal()` + Observable pattern and removes the need for `AsyncPipe`, `subscribe()` or `ChangeDetectorRef`
