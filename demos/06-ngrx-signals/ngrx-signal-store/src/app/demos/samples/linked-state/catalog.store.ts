import { computed, linkedSignal } from '@angular/core';
import { patchState, signalStore, withComputed, withLinkedState, withMethods, withState } from '@ngrx/signals';

export type Course = {
  id: number;
  name: string;
  price: number;
  minSeats: number;
};

const catalog: Course[] = [
  { id: 1, name: 'Angular Signals', price: 1200, minSeats: 2 },
  { id: 2, name: 'SignalStore Deep Dive', price: 1600, minSeats: 3 },
  { id: 3, name: 'Zoneless Migration', price: 900, minSeats: 1 },
  { id: 4, name: 'Signal Forms', price: 1100, minSeats: 4 },
];

type CatalogState = {
  courses: Course[];
  taxRate: number;
};

export const CatalogStore = signalStore(
  withState<CatalogState>({ courses: catalog, taxRate: 0.2 }),
  withLinkedState(({ courses }) => ({
    selectedId: linkedSignal<Course[], number>({
      source: courses,
      computation: (list, previous) =>
        list.some((c) => c.id === previous?.value) ? (previous?.value ?? 0) : (list[0]?.id ?? 0),
    }),
  })),
  withLinkedState(({ courses, selectedId }) => ({
    seats: () => courses().find((c) => c.id === selectedId())?.minSeats ?? 1,
  })),
  withComputed(({ courses, selectedId }) => ({
    selected: computed(() => courses().find((c) => c.id === selectedId()) ?? null),
  })),
  withComputed(({ selected, seats, taxRate }) => ({
    net: computed(() => (selected()?.price ?? 0) * seats()),
    gross: computed(() => Math.round((selected()?.price ?? 0) * seats() * (1 + taxRate()) * 100) / 100),
  })),
  withMethods((store) => ({
    select(selectedId: number) {
      patchState(store, { selectedId });
    },
    setSeats(seats: number) {
      patchState(store, { seats: Math.max(1, seats) });
    },
    setTaxRate(taxRate: number) {
      patchState(store, { taxRate });
    },
    dropSelected() {
      patchState(store, { courses: store.courses().filter((c) => c.id !== store.selectedId()) });
    },
    restoreCatalog() {
      patchState(store, { courses: catalog });
    },
  }))
);
