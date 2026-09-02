# Reactive Programming with RxJS

Demo application for module 05. Start `json-server db.json` before `npm start`.

## Demos

| # | Route | Title | Topic | Teaches |
| --- | --- | --- | --- | --- |
| 1 | subscribe-vs-stream-vs-signal | Subscribe vs Stream vs Signal | Foundations | Compare the three ways to consume an Observable in a component: a manual subscribe() you must tear down, an async pipe binding, and toSignal(). See why toSignal() is the default in Angular 22. |
| 2 | flattening-strategies | Flattening Strategies | Operators | Fire the same request into four pipelines against the live API and watch switchMap, mergeMap, concatMap and exhaustMap disagree. Read the in-flight counters, not just the results. |
| 3 | combining | Combining Streams | Operators | Coordinate several sources with combineLatest, forkJoin, merge and withLatestFrom, three of them over real endpoints. Understand which operator emits when, and which source drives the result. |
| 4 | error-handling | Error Handling | Operators | Recover from a real 404 with catchError and retry, compare EMPTY against a fallback against a rethrow, then package the pattern into a custom operator verified by a marble test. |
| 5 | interop | Signal Interop Both Ways | Signal Interop | Cross the boundary in all four directions: toSignal, toObservable, outputToObservable and outputFromObservable. Then see why rxResource replaces all four for request and response. |
| 6 | debounce-three-ways | Debounce Three Ways | Signal Interop | Delay user input with debounceTime, with the experimental debounced() from @angular/core, and with the Signal Forms debounce() rule. Compare the ceremony and the pending state each one gives you. |
| 7 | rxresource-vs-switchmap | rxResource vs switchMap | Signal Interop | Put a hand-written switchMap search next to rxResource, then chain a dependent request with chain(). See what the resource API gives you for free. |
| 8 | rxjs-to-signals-migration | RxJS to Signals Migration | Migration | Migrate a real BehaviorSubject store to signals with an agent, using the exact prompt and the angular-cli MCP tools shown in the demo, then review the result against the repository antipattern rules. |