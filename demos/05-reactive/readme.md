# RxJS Where It Still Matters

RxJS is no longer the way to hold state in an Angular application: signals are. What RxJS still owns is everything that is genuinely a stream over time, and the boundary between the two worlds. This module is eight demos long and every one of them is about a decision you have to make in Angular 22 code, not about the RxJS API surface.

The through line: consume streams as signals, keep the operators for the problems only operators solve (time, cancellation, retry, coordination), and let `rxResource` / `httpResource` own request and response.

## Run it

```bash
cd ng-reactive
npm install
json-server db.json
npm start
```

The demo list, the guides shown beside each demo and the table below all come from `db.json`.

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

## Links

- [RxJS API reference](https://rxjs.dev/api)
- [RxJS marble testing](https://rxjs.dev/guide/testing/marble-testing)
- [RxJS Marbles](https://rxmarbles.com/)
- [Angular RxJS interop](https://angular.dev/ecosystem/rxjs-interop)
- [Debouncing signals with `debounced`](https://angular.dev/guide/signals/debounced)

## Notes for this module

- Guides live in `ng-reactive/public/markdown`, served from `markdownPath: 'markdown/'`.
- `json-server db.json` is required to run the app at all: the demo list and the guides come from the `demos` collection. Of the demos themselves, `subscribe-vs-stream-vs-signal` and `debounce-three-ways` touch no endpoint, and neither does the `merge` pane in `combining`; the other six do. `error-handling` deliberately requests `/skilz`, which json-server answers with 404.
- The custom operator in `error-handling` is covered by a `TestScheduler` marble test. Run it with `npm test`.
- `ng-reactive/migration-exercise/skills.store.ts` is the "before" file for demo 8. It sits outside `src/` so its anti-patterns are never compiled into the app.
- `debounced()` from `@angular/core` and the Signal Forms `debounce()` rule are both experimental in 22.0. Both are verified present in the installed `@angular/core` 22.1.4 and `@angular/forms` 22.1.4.
