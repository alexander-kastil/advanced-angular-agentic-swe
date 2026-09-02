# Defer Non-Critical Views

## What a defer block does

`@defer` moves everything referenced inside it into a separate chunk. The chunk is requested only when
the trigger fires, so the initial bundle shrinks without removing the feature.

```html
@defer (on viewport) {
  <app-revenue-chart />
} @placeholder (minimum 300ms) {
  <div class="skeleton">Chart</div>
} @loading (minimum 200ms) {
  <p>Loading...</p>
} @error {
  <p role="alert">Could not load the chart.</p>
}
```

## The four blocks

| Block | When it renders | Notes |
| --- | --- | --- |
| main | After the chunk is downloaded and the trigger fired | The only block whose dependencies are split out |
| `@placeholder` | Before the trigger fires | Part of the parent bundle, so keep it tiny |
| `@loading` | While the chunk downloads | `minimum` and `after` prevent a flash on a fast link |
| `@error` | If the chunk fails | Give the user a retry path, not a blank space |

## Triggers

| Trigger | Fires when |
| --- | --- |
| `on idle` | The browser reports idle time. The default when no trigger is given |
| `on viewport` | The placeholder scrolls into view |
| `on interaction` | The placeholder is clicked or receives a keydown |
| `on hover` | The pointer enters the placeholder |
| `on timer(2s)` | After the given delay |
| `on immediate` | As soon as rendering finishes |
| `when expression` | The expression turns truthy. Once true, it does not revert |

Triggers compose: `@defer (on viewport; on timer(5s))` fires on whichever happens first.

## Prefetch separates download from render

```html
@defer (when armed(); prefetch on idle) {
  <app-revenue-chart />
}
```

The chunk downloads during idle time; the component renders when `armed()` becomes true. The user waits
for neither. This is the pattern for anything behind a button you expect most users to press.

## Rules that bite

- A component used inside a defer block must not also be used outside it in the same template. If it is,
  the bundler cannot split it out and the block silently loses its benefit.
- `on interaction`, `on hover` and `on viewport` need something to attach to: either a `@placeholder` or
  an explicit trigger element, `@defer (on viewport(triggerRef))`.
- Deferred content is not server rendered by default. That is a deliberate trade: it is why the chunk is
  smaller.
- Do not defer the LCP element. Deferring the thing the user came for makes the score worse, not better.

## Where to use it

Charts, editors, maps, video players, comment threads, admin panels, anything below the fold, and any
dependency over about 30 kB that is not needed on first paint.
