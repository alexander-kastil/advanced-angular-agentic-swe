# State Management with NgRx SignalStore

[NgRx Docs](https://ngrx.io/docs)

[NgRx SignalStore](https://ngrx.io/guide/signals/signal-store)

NgRx SignalStore is the signal-first approach to application-level state management in Angular. This module covers building stores with `withState()`, `withComputed()` and `withMethods()`, deriving writable state with `withLinkedState()`, managing entity collections with `withEntities()`, composing stores with `withProps()`, `withFeature()`, `signalMethod()` and `signalStoreFeature()`, extending an `httpResource()` with `@ngrx/signals/resource`, and decoupling intent from state with `@ngrx/signals/events`. It closes with the agentic angle: exposing store methods to a browser agent through Angular 22's experimental WebMCP API, and running an agent-driven migration off classic NgRx.

Classic NgRx (`@ngrx/store`, `@ngrx/effects`, `@ngrx/entity`, `@ngrx/data`) is no longer part of this module. `@ngrx/signals` and `@ngrx/operators` are the only NgRx packages the app depends on.

## Demos

| # | Route | Title | Teaches |
|---|-------|-------|---------|
| 1 | app-state | SignalStore App State | Model application state with withState, derive it with withComputed and change it with withMethods and patchState. Inspect the live state snapshot via getState(). |
| 2 | store-crud | SignalStore CRUD | Create, read, update and delete against a REST API with withMethods and rxMethod. Track loading state and derive filtered views with withComputed. |
| 3 | deep-signals | Deep Signals | Read nested state as individual signals with store.user.address.city(), and handle the union case where a state slice is a union of record types and must be narrowed instead. |
| 4 | linked-state | Linked State | Derive writable state from other state with withLinkedState. A linked slice recomputes when its source changes and stays writable in between. |
| 5 | store-entities | SignalStore Entities | Manage a normalized collection with withEntities(). Tour the updater API: setAllEntities, addEntity, updateEntity, updateAllEntities, removeEntity, removeAllEntities. |
| 6 | skills-entities | Skills with withEntities | Back an entity collection with a REST API. Combines withEntities, the withRequestStatus feature and rxMethod for load, add, update and remove. |
| 7 | store-resource | Resource Extensions | Extend an httpResource with @ngrx/signals/resource. withPreviousValueOnLoading keeps the last value while reloading and withValueOnError supplies a fallback. |
| 8 | custom-store-features | Request Status Feature | Build reusable store features with signalStoreFeature. Compose withRequestStatus and withAttempts and drive them with pure updater functions. |
| 9 | store-events | Event-Based Store | Decouple intent from state with @ngrx/signals/events: an eventGroup reduced by withReducer, side effects in withEventHandlers, and scoped dispatching through a component-level Dispatcher. |
| 10 | markdown-editor | Markdown Editor | Compose custom store features into a real store. Uses withMarkdownItems() for entity CRUD and withRequestState() for loading and error tracking. |
| 11 | store-composition | Store Composition | Compose a store from parts: withProps for injected dependencies and observables, withFeature for a feature that needs store members, and signalMethod for a side effect bound to a signal. |
| 12 | webmcp-store | WebMCP Store Tools | Expose SignalStore methods to a browser agent with declareExperimentalWebMcpTool. Each tool declares a JSON schema and calls the same store method the UI calls. |
| 13 | classic-to-signalstore | Classic NgRx to SignalStore | Run an agent-driven migration: the classic actions, reducer, selectors and effects, the SignalStore that replaces them, the prompt that drives it and the checklist you review the diff against. |

## Running

```bash
cd ngrx-signal-store
npm install
npx json-server --watch db.json
npm start
```

Several demos read from `http://localhost:3000`, so start `json-server` against `db.json` before serving the app.
