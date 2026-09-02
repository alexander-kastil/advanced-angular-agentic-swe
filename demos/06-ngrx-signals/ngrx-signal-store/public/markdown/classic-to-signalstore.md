## Overview

This demo is the migration this module's app went through, kept as a worked example: the classic NgRx feature on one tab, the SignalStore that replaced it on the next, the prompt that drives an agent through it on the third, and a checklist you tick off against the resulting diff.

## What Actually Shrinks

The classic feature is four files: actions, reducer plus entity adapter, selectors, effects. The SignalStore is one. That is not only fewer lines, it is fewer places where two things must agree: an action type string no longer has to match in three files, and a selector no longer has to re-derive the shape the reducer just built.

What does not shrink is the async logic. `switchMap` stays `switchMap`, `catchError` becomes `tapResponse`'s error branch, and the cancellation semantics have to survive the move unchanged. This is the part an agent gets wrong quietly.

## The Prompt

The prompt on the third tab is built to be pasted at an agent. Its shape matters more than its wording:

- **Read before writing.** It asks for an inventory of every action, reducer case, selector and effect, and for that list to come back before any code is written. A migration that starts editing immediately will silently drop the case nobody remembered.
- **Name the target APIs.** `withEntities`, the existing `withRequestStatus()` feature, `rxMethod` with `tapResponse`. Left open, an agent invents a third loading flag.
- **Preserve the operator.** Stating that the flattening operator must survive is the one line that protects behaviour rather than structure.
- **Include the cleanup.** Deleting the old files and dropping the packages is part of the task; otherwise the repo ends up with two state layers and one of them is dead.
- **Demand evidence.** A grep showing zero hits for the deleted symbols, plus the build and test output. "Done" is not a result.

## The Review Checklist

The checklist on the page is what you read the diff against. Compiling code passes none of these by itself:

1. Every action became a store method or an event, and nothing dispatches a plain object.
2. Selectors are `withComputed` members, not exported functions over the whole state tree.
3. Effects are `rxMethod` or `withEventHandlers`, and each one still cancels the way it did.
4. Entity collections use `withEntities`, not a hand-rolled ids plus entities record.
5. Loading and error collapsed into one `withRequestStatus` feature instead of three booleans.
6. Store scope is deliberate: `providedIn: 'root'` for shared state, component providers for per-page state.
7. No classic NgRx import survives, and `package.json` lost the packages too.
8. Tests construct the store with `TestBed` and assert on signals.

## Scope Is the Decision the Agent Cannot Make

Classic NgRx had one store, so scope was never a question. SignalStore makes it one, and the answer comes from how the feature is used, not from the code being migrated. Shared across routes means `{ providedIn: 'root' }`. Owned by one page means the component's `providers` array, which also gives you disposal for free. An agent will pick whichever it saw last; decide it yourself and put it in the prompt.
