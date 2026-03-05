Interoperability with NgRx Classic is demonstrated on the `Skills` route.

> **Note:** `@ngrx/data` is in maintenance mode (critical bug fixes only). For new projects prefer `@ngrx/signals` or standard NgRx with effects.

`toSignal()` converts an NgRx Observable to a Signal. Used in `SkillsKpiComponent` to avoid `AsyncPipe`:

```typescript
skills = toSignal(this.service.entities$, { initialValue: [] as Skill[] });
ct = computed(() => this.skills().length);
notCompleted = computed(() => this.skills().filter(sk => !sk.completed).length);
```

`takeUntilDestroyed()` replaces manual `ngOnDestroy` subscription cleanup in `skills-container.component.ts`:

```typescript
constructor() {
  this.service.loaded$.pipe(takeUntilDestroyed()).subscribe((loaded) => {
    if (!loaded) this.service.getAll();
  });
}
```

`skill-row.component.ts` uses signal-based `input()` and `output()` functions instead of decorators:

```typescript
skill = input.required<Skill>();
itemDeleted = output<Skill>();
itemEdit = output<Skill>();
```

NgRx Store provides `selectSignal()` to read state as a Signal — available for classic NgRx and ComponentStore:

```typescript
store = inject(Store) as Store<CustomersState>;
customers = this.store.selectSignal(getCustomers);
```