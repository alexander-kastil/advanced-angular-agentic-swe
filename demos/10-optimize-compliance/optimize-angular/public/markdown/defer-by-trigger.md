# Compare Defer Triggers

## The seven triggers

| Trigger | Fires when | Good for |
| --- | --- | --- |
| `on immediate` | As soon as the surrounding template finishes rendering | Moving code out of the initial bundle and nothing else |
| `on idle` | `requestIdleCallback` reports free time. The default when no trigger is written | Anything the user will probably need soon |
| `on timer(3s)` | A wall-clock delay after render | Rarely the right answer; it fires whether the user cares or not |
| `on hover` | The pointer enters the placeholder or trigger element | Menus, previews, tooltips with real content |
| `on interaction` | Click or keydown on the placeholder or trigger element | Anything behind a button |
| `on viewport` | An `IntersectionObserver` reports the placeholder visible | Below-the-fold content, the workhorse |
| `when expr` | The expression turns truthy. It does not revert | Conditions the application computes itself |

Triggers compose with `;` and fire on whichever comes first:

```html
@defer (on viewport; on timer(5s)) { <app-chart /> }
```

Every one of them also exists in a `prefetch` form, which downloads without rendering:

```html
@defer (on interaction; prefetch on idle) { <app-editor /> }
```

## What the demo actually measures

Two tables, both read from the browser rather than written by hand.

**Render order** comes from the deferred components themselves. Each one injects a small
component-scoped service and records its own construction time relative to the moment the demo mounted.
That is the honest definition of "when the block rendered", because it is the component saying so.

**Payload** comes from `PerformanceObserver` on the `resource` entry type, filtered to script requests
that started after the demo mounted:

```ts
const observer = new PerformanceObserver(list => {
  for (const entry of list.getEntries() as PerformanceResourceTiming[]) {
    if (entry.initiatorType === 'script' && entry.startTime >= start) {
      record(entry.name, entry.encodedBodySize, entry.transferSize, entry.duration);
    }
  }
});
observer.observe({ type: 'resource', buffered: false });
```

Filter on `initiatorType`, not on a `.js` suffix. Under `ng serve` a module URL carries a query string
and a suffix test silently matches nothing, which is exactly the kind of measurement bug that makes a
demo quietly prove the wrong thing.

## Two payload sizes, on purpose

- `LightPanelComponent` has no dependencies. Its chunk is under a kilobyte.
- `HeavyPanelComponent` pulls `moment` in with a dynamic `import()` in its constructor, so the library is
  requested the first time any block renders it.

The dynamic import matters for a reason worth saying in class: under `ng serve` there is no production
bundling, so a *statically* imported dependency is already in the route's module graph before the trigger
fires and the network shows nothing. A dynamic `import()` behaves the same way in development and in a
production build, which is what makes the measurement reproducible on a laptop.

The gap between those two numbers is the entire argument for `@defer`. If a deferred component is
smaller than its placeholder, deferring it made the page slower, not faster: you added a round trip to
save nothing.

## Development numbers are not shipping numbers

Under `ng serve` the sizes are real but unminified and uncompressed, roughly eight times what ships. The
*timing* is exact in both: which trigger paid for the fetch, and which one rendered for free. For the real
sizes, build and read the lazy chunk table.

## Rules that bite

- A component used inside a defer block must not also be used outside it in the same template. If it is,
  the bundler cannot split it out, the chunk merges back into the parent, and the block silently loses
  its benefit while still costing you a placeholder.
- `on interaction`, `on hover` and `on viewport` need something to attach to. Either give the block a
  `@placeholder`, or name an explicit element: `@defer (on viewport(triggerRef))`.
- `on hover` is a mouse event. Keyboard users reach the block only through focus, which `on interaction`
  covers and `on hover` does not. Do not gate essential content on hover alone.
- Deferred content is not server rendered by default. That is the trade that makes the chunk smaller.
- Never defer the LCP element.

## Reading the same numbers before you ship

The demo measures the running app. The build measures the artifact:

```bash
npm run build
```

The lazy chunk table in the build output lists every chunk with its raw and estimated transfer size. A
`@defer` block that does not produce a new row in that table is not deferring anything.

## Where this sits in the module

`defer-views` is the introduction: the four blocks, three triggers, one deferred chart. This demo is the
reference: every trigger at once, with the cost of each one on screen.
