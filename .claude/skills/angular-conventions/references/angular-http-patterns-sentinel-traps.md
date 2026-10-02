# Angular HTTP: Sentinel Infinite-Scroll Traps

Troubleshooting for the sentinel variant of the infinite-scroll pattern.

### Sentinel-driven infinite scroll: three traps that all look identical

Swapping the "Load More" button for an `IntersectionObserver` sentinel introduces three failure modes that
present the same way (nothing ever loads) and stack on top of each other. Rule them out in this order.

**1. The sentinel has zero area.** An empty `<div #sentinel>` collapses to height 0, and IntersectionObserver
reports an empty intersection rect for a zero-area target, so it never intersects even when scrolled fully
into view. Give it real height and pre-load before the exact bottom:

```ts
this.observer = new IntersectionObserver(
  (entries) => { if (entries.some(e => e.isIntersecting)) this.maybeLoadMore(); },
  { rootMargin: '300px' },
);
```
```html
<div #sentinel aria-hidden="true" class="h-4"></div>
```

**2. Nothing on the page actually scrolls.** If the app shell already owns the scroll container, a feature root
of `h-full` is pinned to that height and its card's `overflow-hidden` clips the rows instead of overflowing, so
`scrollHeight === clientHeight` and the sentinel is unreachable. Feature roots must not set `h-full`. Diagnose:

```js
[...document.querySelectorAll('*')].filter(el =>
  el.scrollHeight > el.clientHeight + 20 &&
  ['auto','scroll','overlay'].includes(getComputedStyle(el).overflowY))   // empty array = nothing scrolls
```

**3. You are verifying in a tab that is not being rendered.** A browser-automation tab commonly reports
`document.visibilityState === "hidden"`, and a non-rendered tab never delivers intersections. Setting
`scrollTop` from JS will load nothing, and even an independently attached probe observer fires zero times,
while screenshots still work and make the page look live. Verify with the automation tool's *real* scroll
input, and check `document.visibilityState` before concluding the observer is broken.

Also keep sorting and paging on the same side. Once paging is server-side, a client-side sort only reorders
the rows already fetched while looking like a full sort. Move sorting to the server or remove the affordance.

### A fourth trap: an earlier entry point silently disables the loader

Once the list works, the next optimization is to start the first fetch before the route component
exists: an app-shell constructor, an app initializer, a call placed just before
`router.navigate(['/list'])`. That is a real win, and it breaks the sentinel in a way no unit test
sees.

The background loader is normally gated on a component-local "I started this" flag, so it never fires
for store state seeded another way (a spec preloading via a different method, a stale cache):

```ts
ngOnInit() {
  if (this.store.items().length === 0) {
    this.store.loadInitialItems();
    this.initiatedInitialLoad.set(true);      // component-local
  }
}
// effect: if (!this.initiatedInitialLoad()) return;   <- never true once a prefetch wins the race
```

The prefetch fills the store before `ngOnInit` runs, so `length === 0` is false, the local flag stays
`false`, and the effect that fetches the next block never fires. The list paints its first chunk and
then freezes: scrolling to the bottom loads nothing, forever.

**Move the gate to the store**, where every entry point sets it, and keep the `length === 0` guard in
`ngOnInit` so seeded state still does not fetch:

```ts
// store: loadInitialItems() sets initialLoadStarted before its request
// effect: if (!this.store.initialLoadStarted()) return;
```

Two things about this trap are worth more than the fix. **The whole unit suite stayed green** through
it, because the specs seed the store directly and never exercise the prefetch-wins-the-race ordering;
it was visible only by scrolling the real page. And **the naive repair fails the other way**: dropping
the `length === 0` guard so `ngOnInit` always loads makes `HttpTestingController.verify()` report open
requests in every spec that seeds state. The guard and the gate answer different questions - "is there
data yet" and "did anyone start the load" - and collapsing them into one breaks whichever case you
were not looking at.

After adding any earlier entry point to a paged list, scroll the real page to the bottom three times
and assert the row count grows. A green suite is not evidence here.

**The same gate empties the list if the load runs under `switchMap`.** The prefetch starts the
request and sets `initialLoadStarted`; the list's own `ngOnInit` call arrives while it is still in
flight, `switchMap` unsubscribes the first request (the network panel shows it `ERR_ABORTED`), and
the second projection returns `EMPTY` because the gate is already set. Nothing ever retries, so the
view renders an empty table after every fresh login. A gated one-shot load must flatten with
`exhaustMap`: the second call is ignored while the first is in flight, and the gate covers every
call after it lands. Regression test: call the method twice before flushing and assert one request,
`cancelled === false`, and populated rows after the flush.

Back to the index: [angular-http-patterns](angular-http-patterns.md)
