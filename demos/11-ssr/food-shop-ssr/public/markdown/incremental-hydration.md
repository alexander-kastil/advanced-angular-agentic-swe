- Full hydration boots the whole component tree on load. Incremental hydration keeps parts of that tree as inert server HTML until something asks for them.

- In Angular 22 it is **on by default**. `withIncrementalHydration()` is deprecated because it is now redundant, and `withNoIncrementalHydration()` is the opt-out.

```typescript
provideClientHydration(withEventReplay())
```

## The trigger table

| Block | Server output | Client behaviour |
|---|---|---|
| `@defer (hydrate on immediate)` | full content | hydrates as soon as the app is idle |
| `@defer (hydrate on viewport)` | full content | hydrates when scrolled into view |
| `@defer (hydrate on interaction)` | full content | hydrates on click or focus, and the event is replayed |
| `@defer (hydrate never)` | full content | never hydrates, stays static HTML |
| `@defer (on viewport)` | **placeholder** | loads client-side like a normal deferred block |

- The last row is the important contrast. A `hydrate` trigger renders the **main content** on the server. A plain trigger renders the **placeholder** on the server, so the content never reaches the first paint.

- `hydrate never` is the cheapest thing in the framework: real markup, zero JavaScript, zero listeners. Footers, legal text and static marketing blocks belong here.

## Watching it happen

- Each probe in this demo calls `afterNextRender()` and records the moment it ran. `afterNextRender` never runs on the server, so a recorded timestamp *is* the hydration event.

```typescript
constructor() {
  afterNextRender(() => this.log.mark(this.label()));
}
```

- **Reload the page.** Reaching this route by clicking in the sidebar is a client-side navigation: nothing was server rendered, so every block hydrates at once and the demo shows nothing interesting.

- The `never` block's button is real HTML. Clicking it does nothing, and its counter stays at zero for the life of the page. That is the visible proof that the block was never booted.

## Checking the wire

```bash
npm run build
grep -c '__nghDeferData__' dist/food-shop-ssr/browser/index.html
```

- `ngh=` attributes mark hydratable nodes. `__nghDeferData__` carries the dehydrated-block registry the client needs to hydrate a block later.

- `withEventReplay()` is what makes `hydrate on interaction` feel instant: the click that triggers hydration is buffered and dispatched again once the listeners exist.
