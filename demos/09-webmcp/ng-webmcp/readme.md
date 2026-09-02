# NgRx SignalStore

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
