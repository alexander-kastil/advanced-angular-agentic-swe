# Defer Triggers, Placeholder, Loading and Error

`@defer` moves everything inside the block into its own lazy chunk. The dependencies used **only**
inside the block are what gets split out, so a component imported both inside and outside the block
stays in the eager bundle.

## The four blocks

```html
@defer (on idle) {
  <app-idle-panel />
} @placeholder {
  <p>Waiting for the browser to go idle</p>
} @loading (after 100ms; minimum 500ms) {
  <p>Fetching the idle chunk</p>
} @error {
  <p>The chunk failed to load</p>
}
```

| Block          | Rendered when                                  | Parameters            |
| -------------- | ---------------------------------------------- | --------------------- |
| `@placeholder` | before the trigger fires                       | `minimum`             |
| `@loading`     | while the chunk is being fetched               | `after`, `minimum`    |
| `@error`       | the dynamic import rejected                    | none                  |

`after 100ms` suppresses the loading block for fast chunks so the UI does not flash. `minimum 500ms`
keeps it on screen once it appears, for the same reason.

## Triggers

| Trigger              | Fires                                                        |
| -------------------- | ------------------------------------------------------------ |
| `on idle`            | on the next `requestIdleCallback`. The default trigger.       |
| `on timer(3s)`       | after the given duration                                      |
| `on viewport`        | when the placeholder scrolls into view                        |
| `on interaction`     | on the first click or keydown on the placeholder              |
| `on hover`           | on the first mouseover or focus                               |
| `on immediate`       | as soon as the client finishes rendering                      |
| `when <expression>`  | when the expression turns truthy. It never re-hides the block. |

Triggers combine with `;` and are ORed:

```html
@defer (on interaction; on timer(10s); prefetch on idle) { ... }
```

`prefetch on ...` fetches the chunk early without rendering it, so the block is instant when the
real trigger fires.

## What the demo shows

Three blocks side by side: `on idle`, `on timer(3s)` and `on interaction; on timer(10s)` with a
prefetch. Each deferred panel prints its own construction time, so you can see when the chunk
actually arrived. The **Remount blocks** button removes the whole set from the DOM and puts it back,
which is the only way to watch the triggers fire a second time: once a block has rendered, it stays
rendered.

## Gotchas

- `@error` catches a failed dynamic import, not an exception thrown while the loaded component
  renders. That one goes to the `ErrorHandler`.
- `on viewport` and `on interaction` need something to observe, so a `@placeholder` is mandatory for
  them.
- `on timer` accepts `ms` and `s` only.
