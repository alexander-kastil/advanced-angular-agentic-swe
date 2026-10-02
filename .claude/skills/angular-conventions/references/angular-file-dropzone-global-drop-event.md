# File Drop Zone: Global NgRx Event Variant

### Shell-to-feature events (shared/global drop target, sidebar buttons)

A drop zone or button that lives in a shared shell (a global sidebar, the home shell) and must reach whichever feature is active dispatches an **NgRx Signals event** (`@ngrx/signals/events`). The feature subscribes with `Events.on(...)` for as long as it lives.

Never model a press or a drop as store state (`{ seq, files }`) watched by an `effect()`. A signal holds state, not events: equal values do not notify, so the pattern needs a counter, then a "last seq seen" guard against replay, and that guard swallows the first real event whenever the counter resets. Angular's guidance: avoid effects for propagating changes.

```ts
// shared/ui/sidebar.events.ts
export const sidebarEvents = eventGroup({
  source: 'Sidebar',
  events: {
    actionPressed: type<string>(),
    filesUploaded: type<File[]>(),
  },
});
```

```ts
// in the shell (drop handler / button)
private dispatch = injectDispatch(sidebarEvents);

onDrop(e: DragEvent) {
  e.preventDefault(); this.dragging.set(false);
  const files = Array.from(e.dataTransfer?.files ?? []);
  if (files.length) this.dispatch.filesUploaded(files);
}
```

```ts
// in the active feature (constructor, injection context)
inject(Events).on(sidebarEvents.filesUploaded).pipe(
  map(({ payload }) => payload[0]),
  filter((file): file is File => !!file),
  switchMap((file) => this.documents.categorize(file).pipe(map((result) => ({ file, result })))),
  takeUntilDestroyed(),
).subscribe(({ file, result }) => this.route(file, result));
```

`switchMap` drops a stale async response when a newer drop arrives; no sequence bookkeeping.

In specs, dispatch directly: `TestBed.inject(Dispatcher).dispatch(sidebarEvents.actionPressed('save'))`.

Back to the index: [angular-file-dropzone](angular-file-dropzone.md)
