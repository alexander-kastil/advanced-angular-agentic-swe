import { computed } from '@angular/core';
import { getState, patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export type Density = 'compact' | 'comfortable' | 'spacious';

type AppSettingsState = {
  appTitle: string;
  darkMode: boolean;
  density: Density;
  pageSize: number;
};

const initialState: AppSettingsState = {
  appTitle: 'NgRx SignalStore',
  darkMode: true,
  density: 'comfortable',
  pageSize: 10,
};

export const AppSettingsStore = signalStore(
  withState(initialState),
  withComputed(({ appTitle, darkMode, density, pageSize }) => ({
    summary: computed(() => `${appTitle()} - ${darkMode() ? 'dark' : 'light'} / ${density()} / ${pageSize()} rows`),
    rowHeight: computed(() => ({ compact: 32, comfortable: 44, spacious: 60 })[density()]),
  })),
  withMethods((store) => ({
    setTitle(appTitle: string) {
      patchState(store, { appTitle });
    },
    toggleDarkMode() {
      patchState(store, { darkMode: !store.darkMode() });
    },
    setDensity(density: Density) {
      patchState(store, { density });
    },
    setPageSize(pageSize: number) {
      patchState(store, { pageSize });
    },
    reset() {
      patchState(store, initialState);
    },
    snapshot() {
      return JSON.stringify(getState(store), null, 2);
    },
  }))
);
