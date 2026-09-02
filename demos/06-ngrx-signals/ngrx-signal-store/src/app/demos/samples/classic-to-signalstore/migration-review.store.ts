import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export type ReviewItem = {
  id: number;
  text: string;
  done: boolean;
};

const checklist: ReviewItem[] = [
  { id: 1, text: 'Every action has become either a store method or an event, and nothing dispatches a plain object.', done: false },
  { id: 2, text: 'Selectors are withComputed members, not exported functions taking the whole state tree.', done: false },
  { id: 3, text: 'Effects are rxMethod or withEventHandlers, and each one still cancels correctly (switchMap vs concatMap).', done: false },
  { id: 4, text: 'Entity collections use withEntities, not a hand-rolled ids plus entities record.', done: false },
  { id: 5, text: 'Loading and error flags collapsed into one withRequestStatus feature instead of three booleans.', done: false },
  { id: 6, text: 'Store scope is deliberate: providedIn root for shared state, component providers for per-page state.', done: false },
  { id: 7, text: 'No @ngrx/store, @ngrx/effects, @ngrx/entity or @ngrx/data import survives, and package.json lost them too.', done: false },
  { id: 8, text: 'Tests construct the store with TestBed and assert on signals, not on reducer return values.', done: false },
];

export const MigrationReviewStore = signalStore(
  withState<{ items: ReviewItem[] }>({ items: checklist }),
  withComputed(({ items }) => ({
    doneCount: computed(() => items().filter((i) => i.done).length),
    progress: computed(() => Math.round((items().filter((i) => i.done).length / items().length) * 100)),
  })),
  withMethods((store) => ({
    toggle(id: number) {
      patchState(store, { items: store.items().map((i) => (i.id === id ? { ...i, done: !i.done } : i)) });
    },
    reset() {
      patchState(store, { items: checklist });
    },
  }))
);
