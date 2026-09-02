## Overview

The **Skills** feature is an entity collection backed by a REST API. It is the answer to "what replaces `@ngrx/data`": one `signalStore` composing `withEntities()`, the shared `withRequestStatus()` feature, and `rxMethod` per operation.

Examine `skills.store.ts` and `skills.service.ts`. The same store powers the top-level `/skills` route and this demo page, because it is declared `{ providedIn: 'root' }`.

## The Store

```typescript
export const SkillsStore = signalStore(
  { providedIn: 'root' },
  withEntities<Skill>(),
  withRequestStatus(),
  withState({ showAll: true }),
  withComputed(({ entities, showAll }) => ({
    visibleSkills: computed(() => {
      const all = [...entities()].sort((a, b) => a.id - b.id);
      return showAll() ? all : all.filter((s) => !s.completed);
    }),
    total: computed(() => entities().length),
    openCount: computed(() => entities().filter((s) => !s.completed).length),
  })),
```

Three features stack into one flat API surface: `store.entities()`, `store.isPending()` and `store.visibleSkills()` all sit on the same object.

## One rxMethod per Operation

```typescript
add: rxMethod<Skill>(
  pipe(
    switchMap((skill) => {
      patchState(store, setPending());
      return service.addSkill(skill).pipe(
        tapResponse({
          next: (created) => patchState(store, addEntity(created), setFulfilled()),
          error: (err: Error) => patchState(store, setError(err.message)),
        })
      );
    })
  )
),
```

`patchState()` takes several updaters at once, so the entity write and the status write land in a single state change.

`update` and `remove` follow the same shape with `updateEntity({ id, changes })` and `removeEntity(id)`.

## Loading on Creation

```typescript
withHooks({
  onInit({ load }) {
    load();
  },
})
```

Because the store is root-provided, the first component that injects it triggers the load once; every later consumer reads the collection that is already there.

## What Went Away

The previous implementation used `@ngrx/data` with `EntityCollectionServiceBase`, an entity metadata map, a custom `DefaultDataService` and `provideEntityData()` in `app.config.ts`. All of it is gone. `@ngrx/data` is in maintenance mode, and `withEntities()` covers the same ground with less indirection and no observables in the components.

> The demo talks to `http://localhost:3000/skills`. Run `json-server` against the app's `db.json` to see live data.
