import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods } from '@ngrx/signals';
import {
  addEntity,
  removeAllEntities,
  removeEntity,
  setAllEntities,
  updateAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';

export type Task = {
  id: number;
  title: string;
  priority: 'low' | 'high';
  done: boolean;
};

const seed: Task[] = [
  { id: 1, title: 'Model the state', priority: 'high', done: true },
  { id: 2, title: 'Add withEntities', priority: 'high', done: false },
  { id: 3, title: 'Wire the updaters', priority: 'low', done: false },
  { id: 4, title: 'Write the guide', priority: 'low', done: false },
];

export const TasksStore = signalStore(
  withEntities<Task>(),
  withComputed(({ entities, ids }) => ({
    total: computed(() => ids().length),
    openCount: computed(() => entities().filter((t) => !t.done).length),
    highPriority: computed(() => entities().filter((t) => t.priority === 'high')),
  })),
  withMethods((store) => ({
    seed() {
      patchState(store, setAllEntities(seed));
    },
    addTask(title: string) {
      const nextId = store.ids().reduce<number>((max, id) => (Number(id) > max ? Number(id) : max), 0) + 1;
      const task: Task = { id: nextId, title, priority: 'low', done: false };
      patchState(store, addEntity(task));
    },
    toggle(id: number) {
      patchState(store, updateEntity({ id, changes: (t) => ({ done: !t.done }) }));
    },
    promote(id: number) {
      patchState(store, updateEntity({ id, changes: { priority: 'high' } }));
    },
    completeAll() {
      patchState(store, updateAllEntities({ done: true }));
    },
    remove(id: number) {
      patchState(store, removeEntity(id));
    },
    clear() {
      patchState(store, removeAllEntities());
    },
  }))
);
