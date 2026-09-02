## Overview

`signalStore()` builds a state container out of composable features. This demo uses the three that every store starts with: `withState()` declares the shape, `withComputed()` derives from it, and `withMethods()` is the only place allowed to change it.

Examine `app-settings.store.ts` next to the demo component.

## Declaring State

```typescript
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

export const AppSettingsStore = signalStore(withState(initialState));
```

Every root property becomes its own signal: `store.appTitle()`, `store.darkMode()`.

## Deriving with withComputed

```typescript
withComputed(({ appTitle, darkMode, density, pageSize }) => ({
  summary: computed(() => `${appTitle()} - ${darkMode() ? 'dark' : 'light'} / ${density()} / ${pageSize()} rows`),
  rowHeight: computed(() => ({ compact: 32, comfortable: 44, spacious: 60 })[density()]),
}))
```

Computed members are read-only signals; they recalculate only when a dependency changes.

## Changing State with withMethods

State is protected by default, so `patchState()` may only be called from inside a store method:

```typescript
withMethods((store) => ({
  toggleDarkMode() {
    patchState(store, { darkMode: !store.darkMode() });
  },
  setDensity(density: Density) {
    patchState(store, { density });
  },
  reset() {
    patchState(store, initialState);
  },
  snapshot() {
    return JSON.stringify(getState(store), null, 2);
  },
}))
```

`getState()` returns the whole state object as a plain value and stays reactive, which is what feeds the live JSON panel in the demo.

## Providing the Store

`AppSettingsStore` is listed in the component's `providers`, so its lifetime matches the demo page. Pass `{ providedIn: 'root' }` as the first `signalStore()` argument instead when the state must outlive a single route, as `LayoutStore` and `customersStore` do in this app.
