# Zoneless Async

This app runs on `provideZonelessChangeDetection()`. There is no Zone.js, so `fakeAsync`, `tick()` and `flush()` are gone, and `done` callbacks were never a good idea. Four tools replace them.

| Tool | Use it for |
| --- | --- |
| `fixture.whenStable()` | waiting for awaited work to finish and the view to catch up |
| `TestBed.tick()` | flushing effects and rendering synchronously |
| `vi.useFakeTimers()` | timers, so a spec never waits a real second |
| `TestBed.getLastFixture()` | reaching a fixture a helper created |

## whenStable needs a pending task

`whenStable()` resolves when the application is stable. A bare promise is invisible to the framework, so wrap awaited work in `PendingTasks`:

```typescript
private readonly pendingTasks = inject(PendingTasks);

load(): Promise<void> {
  this.status.set('loading');
  return this.pendingTasks.run(async () => {
    const rows = await this.fetchRows();
    this.rows.set(rows);
    this.status.set('loaded');
  });
}
```

Now the spec waits for exactly that work and for the render that follows it:

```typescript
it('has rendered the loaded rows once whenStable resolves', async () => {
  component.load();
  await fixture.whenStable();

  expect(fixture.nativeElement.querySelectorAll('[data-testid="row"]').length).toBe(3);
});
```

Without `PendingTasks.run()` the application looks stable while the promise is still in flight, `whenStable()` resolves too early and the assertion fails intermittently. That is the single most common zoneless test bug.

## TestBed.tick replaces flushEffects

`TestBed.tick()` runs change detection for the whole `TestBed` application, effects included. It is the supported replacement for `TestBed.flushEffects()`, which is deprecated in v22.

```typescript
it('renders a signal change with TestBed.tick and no detectChanges call', () => {
  component.rows.set(['written directly']);

  TestBed.tick();

  expect(text(fixture, 'row')).toBe('written directly');
});
```

Effects coalesce, which is visible and worth showing to students:

```typescript
it('flushes effects with TestBed.tick', () => {
  component.status.set('loading');
  component.status.set('loaded');

  TestBed.tick();

  expect(component.history()).toEqual(['idle', 'loaded']);
});
```

Two writes, one effect run. `'loading'` never reaches the effect. A spec that asserts every intermediate value of a signal is asserting something the framework does not promise.

## Fake timers, narrowly

```typescript
vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
component.startTicking();

vi.advanceTimersByTime(3000);
TestBed.tick();

expect(component.ticks()).toBe(3);
```

Note the `toFake` list. Angular's zoneless scheduler uses `setTimeout` itself, so faking *every* timer can leave change detection with no way to run. Fake only the timer the component under test uses, then flush rendering yourself with `TestBed.tick()`. Restore with `vi.useRealTimers()` in `afterEach`.

## TestBed.getLastFixture

When a helper or a `beforeEach` creates the fixture and does not hand it back, `TestBed.getLastFixture<T>()` returns the most recently created one.

```typescript
TestBed.createComponent(ZonelessAsyncComponent).detectChanges();

const created = TestBed.getLastFixture<ZonelessAsyncComponent>();
created.componentInstance.load();
await created.whenStable();
```

Useful for shared setup helpers. Do not build a suite on it: an explicit fixture variable says which component the assertion is about, and this does not.

## The migration table

| Zone.js era | Zoneless v22 |
| --- | --- |
| `fakeAsync(() => { ... tick(); })` | `vi.useFakeTimers()` plus `TestBed.tick()` |
| `flush()` | `await fixture.whenStable()` |
| `TestBed.flushEffects()` | `TestBed.tick()` |
| `it('...', (done) => ...)` | `it('...', async () => { await ... })` |
| `async(() => ...)` / `waitForAsync` | plain `async` test functions |
