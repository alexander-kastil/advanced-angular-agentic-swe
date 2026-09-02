## Overview

`withLinkedState()` adds state that is derived from other state and still writable. It is the middle ground between `withState()` (writable, never recomputes) and `withComputed()` (recomputes, never writable).

Examine `catalog.store.ts` next to the demo component.

## Why Not Just computed()

A computed value cannot be assigned. The moment a user needs to override the derived value (a suggested quantity, a preselected row, a default currency), `withComputed()` is the wrong tool, and hand-rolling the same thing with an `effect()` that writes back into state reintroduces the glitch you were avoiding.

Linked state solves both: it starts from the source, accepts writes, and resets when the source changes.

## The Shorthand Form

A plain factory function becomes a `linkedSignal` with that computation:

```typescript
withLinkedState(({ courses, selectedId }) => ({
  seats: () => courses().find((c) => c.id === selectedId())?.minSeats ?? 1,
}))
```

`seats` starts at the selected course's minimum. Typing a different number writes over it through `patchState`. Selecting another course changes the source, so `seats` snaps back to that course's minimum.

## The linkedSignal Form

When the reset needs to look at the previous value, pass a `linkedSignal` instead:

```typescript
withLinkedState(({ courses }) => ({
  selectedId: linkedSignal<Course[], number>({
    source: courses,
    computation: (list, previous) =>
      list.some((c) => c.id === previous?.value) ? (previous?.value ?? 0) : (list[0]?.id ?? 0),
  }),
}))
```

This is the "keep the selection if it survived" pattern. Remove the selected course and `selectedId` falls back to the first remaining one instead of pointing at an entry that no longer exists. Remove any other course and the selection is untouched.

## Ordering

`withLinkedState()` only sees what was declared before it, which is why the store declares `selectedId` in one block and `seats`, which depends on it, in a second one.

Linked state is real state: it shows up in `getState()`, it is patched with `patchState()`, and `withComputed()` blocks placed after it read it like any other slice.

```typescript
withMethods((store) => ({
  setSeats(seats: number) {
    patchState(store, { seats: Math.max(1, seats) });
  },
}))
```
