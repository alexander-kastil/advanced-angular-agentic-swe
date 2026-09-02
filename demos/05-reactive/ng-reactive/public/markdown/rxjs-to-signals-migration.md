# RxJS to Signals Migration

An agent can rewrite a `BehaviorSubject` store into signals in one pass. The value of the exercise is not the rewrite, it is having something to check the rewrite against.

## The file to migrate

`ng-reactive/migration-exercise/skills.store.ts` is real code, not a screenshot. It sits outside `src/` on purpose: `tsconfig.app.json` compiles only the graph reachable from `src/main.ts`, so the anti-patterns in it never reach the bundle while still being a file the agent can open and edit.

It contains four separable problems:

- a `BehaviorSubject` holding local state
- a `subscribe()` in `load()` driving that state
- a hand-rolled `status` machine
- a derived `visible$` that is really a `computed()`

## The tools

The `angular-cli` MCP server is declared in `.mcp.json` at the repository root and started with `npx -y @angular/cli mcp`. The tools the prompt calls, by their real names:

| Tool | Used for |
| --- | --- |
| `list_projects` | find the workspace path and project name before editing |
| `get_best_practices` | load the coding standards for the **installed** Angular version, not the model's memory of it |
| `search_documentation` | check `httpResource` and `rxResource` semantics against angular.dev |
| `run_target` | run build and test without leaving the agent loop |

`get_best_practices` is the one that earns its place. It reads the installed version out of the workspace, so an agent that calls it cannot propose a v17 idiom in a v22 codebase.

## The prompt

The demo prints it verbatim with a copy button. Its shape is the point:

1. **One file, named.** Not a folder, not "the store".
2. **Tools first.** The three MCP calls happen before any edit.
3. **A rule set, by path.** `.claude/skills/angular-conventions/references/angular-antipatterns.md`, sections "State Management" and "Data Loading".
4. **A fence.** Keep the public method names. Without a boundary the agent also renames methods, reorders members and "improves" the template, and the review becomes a full re-read instead of a diff.
5. **A required output shape.** "Report back as a table: changed line to the antipatterns row it satisfies." This converts the review from reading code to checking a mapping.
6. **A verification step.** Finish with `run_target`.

## The rule set

| Wrong | Correct |
| --- | --- |
| `BehaviorSubject` for local state | `signal()` |
| `Observable`-only state without signals | Combine with `toSignal()` or use `resource()` |
| `subscribe()` in component body | `toSignal()`, async pipe, or `resource()` |
| Manual `http.get()` + `BehaviorSubject` wiring | `httpResource()` or `resource()` |
| `subscribe()` in `ngOnInit` for HTTP | `resource()` with declarative loader |

One row of that file, "Default change detection on components", is superseded in this repository: explicit `changeDetection: ChangeDetectionStrategy.OnPush` has been removed from every component in these demos by owner decision, because it is the Angular 22 default.

## What to check by hand

- **Status machine deleted, not translated.** The point of `httpResource()` is that `isLoading()` and `error()` already exist. A migration that keeps a hand-rolled `status` signal has moved the anti-pattern rather than removed it.
- **Derived state is `computed()`, not an `effect()` writing a signal.** `visible$` becomes a `computed()`; if it comes back as an effect that sets a `visible` signal, the agent translated the syntax and kept the design.
- **The subscription is gone, not hidden.** A `.subscribe()` moved into a service is still a subscription nobody tears down.
- **Behaviour parity.** The old store replayed the last value to late subscribers, because `BehaviorSubject` does. A `signal()` does that naturally; a plain `Subject` did not. Check whether anything depended on the difference.
- **The build.** `run_target` with target `build` is not optional. An agent that reports a migration without a green build has reported an intention.
