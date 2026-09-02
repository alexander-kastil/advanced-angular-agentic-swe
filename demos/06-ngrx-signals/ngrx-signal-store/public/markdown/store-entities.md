## Overview

`withEntities()` adds a normalized collection to a store: an `entityMap`, an `ids` array, and an `entities` signal derived from both. It ships a set of pure updater functions that you pass to `patchState()`.

Examine `tasks.store.ts` next to the demo component. The store is in-memory so every updater is visible without a server.

## Adding the Feature

```typescript
export type Task = { id: number; title: string; priority: 'low' | 'high'; done: boolean };

export const TasksStore = signalStore(
  withEntities<Task>(),
  withComputed(({ entities, ids }) => ({
    total: computed(() => ids().length),
    openCount: computed(() => entities().filter((t) => !t.done).length),
  })),
);
```

An entity type with an `id` property needs no configuration. For a different key use `entityConfig({ selectId })`.

## The Updater API

| Updater | Effect |
| --- | --- |
| `setAllEntities(list)` | replaces the whole collection |
| `setEntities(list)` / `setEntity(item)` | inserts or replaces by id |
| `addEntity(item)` / `addEntities(list)` | appends, ignoring existing ids |
| `prependEntity(item)` | inserts at the front |
| `updateEntity({ id, changes })` | patches one entity |
| `updateAllEntities(changes)` | patches every entity |
| `removeEntity(id)` / `removeEntities(ids)` | removes by id |
| `removeAllEntities()` | empties the collection |

`changes` accepts either a partial object or a function of the current entity:

```typescript
toggle(id: number) {
  patchState(store, updateEntity({ id, changes: (t) => ({ done: !t.done }) }));
},
promote(id: number) {
  patchState(store, updateEntity({ id, changes: { priority: 'high' } }));
},
completeAll() {
  patchState(store, updateAllEntities({ done: true }));
},
```

## Reading the Collection

`entities()` is ordered by `ids()`, so the template iterates it directly:

```html
@for (t of store.entities(); track t.id) { ... }
```

Never store a derived list in state. Put it in `withComputed()` and let it recalculate.

## Next

The **Skills with withEntities** demo wires the same feature to a REST API and adds request-status tracking.
