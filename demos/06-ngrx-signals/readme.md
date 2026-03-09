# State Management with NgRx SignalStore

[NgRx Docs](https://ngrx.io/docs)

[Chrome Redux Dev Tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=de)

NgRx SignalStore is the modern, signal-first approach to application-level state management in Angular. This module covers building stores with `withState()`, `withComputed()`, and `withMethods()`, managing entity collections with `withEntities()`, and writing reusable custom store features. You will also see how SignalStore interoperates with classic NgRx reducers and effects for gradual migration.

## Demos

| #   | Route                 | Title                 | Teaches                                                                                                                             |
| --- | --------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | app-state             | SignalStore App State | Create and manage application state with @ngrx/signals SignalStore. Define state shape and access it reactively with signals.       |
| 2   | store-crud            | SignalStore CRUD      | Implement Create, Read, Update, Delete operations in SignalStore. Manage entity mutations and side effects with effects().          |
| 3   | store-entities        | SignalStore Entities  | Efficiently manage collections of entities using withEntities() feature. Implement entity adapters for normalized state management. |
| 4   | deep-signals          | Deep Signals          | Create deeply nested signals for complex state structures. Access and update nested properties with automatic reactivity.           |
| 5   | custom-store-features | Custom Store Features | Build reusable store features with custom logic. Extend SignalStore with domain-specific functionality and computed values.         |
| 6   | ngrx-interop          | NgRx Classic Interop  | Integrate SignalStore with classic NgRx features. Migrate from traditional reducers and effects to signal-based store patterns.     |
