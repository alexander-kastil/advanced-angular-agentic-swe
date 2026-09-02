# Zoneless Change Detection

## What zone.js did, and what replaced it

`zone.js` monkey-patched every asynchronous browser API: `setTimeout`, `Promise`, `addEventListener`,
`XMLHttpRequest`, `requestAnimationFrame`. Anything that finished inside the patched zone told Angular
"something might have changed", and Angular checked the whole component tree.

Angular 22 defaults to zoneless. Nothing is patched. Angular is told about work in exactly three ways:

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection()]
};
```

## What schedules a refresh

| Source | Schedules | Why |
| --- | --- | --- |
| `signal.set()` / `update()` | yes | The signal notifies every view that read it |
| A `computed()` a template reads | yes | Its dependency graph ends in a signal |
| `(click)`, `(input)`, any template listener | yes | The compiler marks the view dirty in the generated listener |
| `async` pipe emission | yes | The pipe calls `markForCheck()` itself |
| `resource()` / `httpResource()` | yes | Their `value`, `status` and `error` are signals |
| `input()` binding change | yes | Signal inputs are signals |
| `ChangeDetectorRef.markForCheck()` | yes | The manual escape hatch |
| A bare `setTimeout` callback | **no** | Nothing patches the timer any more |
| A resolved promise | **no** | The microtask is invisible until it touches reactive state |
| `element.addEventListener` written by hand | **no** | Not compiled, so it marks nothing |
| Mutating a plain class field | **no** | There is nothing to notice the write |

## The failure you will actually hit

```ts
export class StaleComponent {
  count = 0;

  start() {
    setTimeout(() => {
      this.count += 1;
    }, 600);
  }
}
```

`count` really does become 1. The screen keeps showing 0. Nothing is broken: Angular was never told.

The demo makes this visible, with one caveat worth saying out loud in class. Clicking *any* button in the
component triggers change detection, because template listeners mark the view dirty. So the stale value
refreshes the moment you touch anything. Arm the plain path and then keep your hands off the keyboard.

Two fixes, in order of preference:

```ts
readonly count = signal(0);
start() {
  setTimeout(() => this.count.update(value => value + 1), 600);
}
```

```ts
private cdr = inject(ChangeDetectorRef);
start() {
  setTimeout(() => {
    this.count += 1;
    this.cdr.markForCheck();
  }, 600);
}
```

Reach for `markForCheck()` only when the state genuinely cannot be a signal, which in practice means
third-party code writing into your instance.

## Telling Angular that async work is in flight

`PendingTasks` is how a zoneless app reports that it is busy. It is what `ApplicationRef.isStable`,
`whenStable()` and server-side rendering wait on.

```ts
private pendingTasks = inject(PendingTasks);

load() {
  const done = this.pendingTasks.add();
  fetchSomething().finally(done);
}

// or, for a promise you already have
this.pendingTasks.run(async () => {
  this.data.set(await fetchSomething());
});
```

Without it, SSR serializes the page before your data arrives and tests using `whenStable()` resolve early.
`httpResource()` and the `HttpClient` register pending tasks for you; hand-rolled `fetch` does not.

## Counting renders

```ts
constructor() {
  afterEveryRender(() => {
    this.renders += 1;
  });
}
```

Note that `renders` is a plain field on purpose. Writing a *signal* inside `afterEveryRender` schedules
another render, which increments again, which schedules again: an infinite loop. If you need render
counts on screen, keep the counter plain and read it during the next refresh, exactly as this demo does.

`afterEveryRender` also takes a phase object (`earlyRead`, `write`, `mixedReadWrite`, `read`) when you
have to touch the DOM directly. Use the phases: they are what stops a manual DOM read from forcing a
layout in the middle of a write pass.

## Checklist before you turn it on

- Remove `zone.js` from `package.json` and from `angular.json` polyfills. If it is still in the bundle
  you have paid for it without using it.
- Grep for `NgZone`. `runOutsideAngular` is a no-op in a zoneless app; `run` is close to one. Delete both.
- Grep for `setTimeout`, `setInterval`, `.then(`, `fetch(` and `addEventListener` in components. Every hit
  is a candidate for the stale-field bug above.
- Every component defaults to `OnPush` in v22, so a parent that never marks a child dirty means the child
  never refreshes. Signals in, signals out.
- There is no `ng generate` schematic for the zoneless switch itself. The generators shipped in
  `@angular/core` 22.1.4 that help are `signals`, `signal-input-migration`, `signal-queries-migration` and
  `cleanup-unused-imports`. The Angular CLI MCP server exposes an `onpush_zoneless_migration` tool that
  walks an agent through the rest.

## Where this sits in the module

`configure-zoneless` shows the provider and a form running under it. This demo is about the mechanism:
what tells Angular to look, and what silently does not.
