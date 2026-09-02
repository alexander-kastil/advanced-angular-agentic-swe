# Migration exercise

`skills.store.ts` is the "before" file for the `rxjs-to-signals-migration` demo. It lives outside
`src/` on purpose: `tsconfig.app.json` compiles only the graph reachable from `src/main.ts`, so the
anti-patterns in here never reach the application bundle.

Copy the prompt from the demo, run it against this file, and check the result against
`.claude/skills/angular-conventions/references/angular-antipatterns.md`.

What the agent has to remove:

- a `BehaviorSubject` holding local state
- a `subscribe()` driving that state
- a hand-rolled `status` machine that `httpResource()` already provides
- a derived `visible$` that should be a `computed()`
