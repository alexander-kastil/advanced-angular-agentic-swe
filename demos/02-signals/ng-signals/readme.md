# Signals Demo Module

| #   | Route | Title | Teaches | Topic |
| --- | ----- | ----- | ------- | ----- |
| 1 | `signals-basics` | Signals Basics | Create reactive state with signal(). Use computed() for derived state and effect() for side effects. Read values by calling the signal as a function, update with .set() and .update(). | Signals Fundamentals |
| 2 | `http-resource` | HTTP Resource API | Load and display async data with httpResource(). Handle loading state, errors, and display data conditionally in templates. | Signals Fundamentals |
| 3 | `signal-effects` | Signal Effects & Filtering | Use effect() to react to signal changes for side effects. Track filter state with signals and update httpResource() parameters dynamically. Demonstrates conditional data loading. | Signals Fundamentals |
| 4 | `signal-inputs` | Input Signals | Define typed component inputs as signals using input() and input.required(). Derive state from inputs with computed(). | Signals Fundamentals |
| 5 | `signal-equality` | Signal Equality | Define custom equality comparisons with the equal option. Control when computed() and dependents re-run. Avoid unnecessary notifications for deep mutations. | Signals Fundamentals |
| 6 | `linked-signal-reset` | LinkedSignal & Reset | Create writable dependent signals with linkedSignal(). Keep signals synced while allowing independent updates. Reset derived signals to base state. | Signal Patterns |
| 7 | `linked-signal-set` | LinkedSignal with a Custom Set | Intercept writes to a linkedSignal with the set option. Keep derived state writable while clamping or logging every write, and recompute it from its source. | Signal Patterns |
| 8 | `effect-cleanup` | Effect Cleanup & One-Shot Effects | Release timers and listeners with the onCleanup callback of effect(). Run initialization logic exactly once and stop an effect with its EffectRef destroy(). | Signal Patterns |
| 9 | `model-inputs` | Model Two-Way Binding | Implement two-way binding with the model() signal API. Parent and child components sync data mutually without manual event handling. | Signal Patterns |
| 10 | `container-presenter` | Signals Container-Presenter | Apply the Container-Presenter pattern using signals. The container manages state and httpResource data, presenters display UI and emit events. | Signal Patterns |
| 11 | `rxjs-interop` | RxJS Interop | Bridge RxJS and signals with toSignal(), toObservable() and rxResource(). Consume streams as signals and drive streams from signal state. | Signal Patterns |
| 12 | `resource-chain` | Chained Resources | Sequence dependent async work with the chain() operator from the resource params context. Propagate loading, idle and error status down a chain of resources without manual undefined checks. | Async Signals |
| 13 | `debounced-search` | Debounced Search | Wrap a signal with debounced() from @angular/core and drive an httpResource search from the settled value. Read the debounce status to show a typing indicator. | Async Signals |
| 14 | `service-injectasync` | Service Decorator & injectAsync | Declare services with the @Service() decorator and load them lazily with injectAsync() plus onIdle prefetching. Run the ng generate @angular/core:service-migration schematic to convert @Injectable. | Signals Tooling |
| 15 | `webmcp-signal` | Signals as WebMCP Tools | Expose a signal value and its setter to an AI agent with declareExperimentalWebMcpTool() and register page-level tools with provideExperimentalWebMcpTools(). | Signals Tooling |
| 16 | `devtools-signal-graph` | Reading the Signal Graph | Build a deliberately layered dependency graph of signal, computed, linkedSignal, httpResource and effect nodes, name every node with debugName and read the graph in Angular DevTools. | Signals Tooling |
