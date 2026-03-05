# Test Migration: Karma/Jasmine to Vitest (Zoneless)

## Summary

| Metric | Value |
|--------|-------|
| Test Files | 40 |
| Tests | 127 |
| Passing | 127 (100%) |
| Framework | Vitest 4.x + jsdom |
| Runner | `@angular/build:unit-test` |
| Angular | 21.2 (Zoneless, OnPush) |

## Infrastructure Changes

| Change | Details |
|--------|---------|
| Test runner | Karma + Jasmine → `@angular/build:unit-test` with Vitest |
| Zone.js | Removed from polyfills and dependencies |
| Change detection | `provideZonelessChangeDetection()` added |
| Animations | `provideAnimations()` → `provideAnimationsAsync()` |
| Components | All 52+ components migrated to `ChangeDetectionStrategy.OnPush` |
| TypeScript types | `jasmine` → `vitest/globals` |
| Config files | Added `vitest.config.ts`, `test-setup.ts` |

## API Migration Patterns

| Jasmine / Zone.js | Vitest / Zoneless | Notes |
|-------------------|-------------------|-------|
| `spyOn(obj, method)` | `vi.spyOn(obj, method)` | |
| `.and.returnValue()` | `.mockReturnValue()` | |
| `.and.callFake()` | `.mockImplementation()` | |
| `jasmine.createSpyObj()` | `{ method: vi.fn() }` | Manual mock objects |
| `toBeTrue()` / `toBeFalse()` | `toBe(true)` / `toBe(false)` | |
| `toHaveSize()` | `toHaveLength()` | |
| `DoneFn` callback | `return new Promise<void>()` | |
| `.calls.mostRecent()` | `spy.mock.results[spy.mock.calls.length - 1]` | |
| `fakeAsync(() => {})` | `vi.useFakeTimers()` + `vi.useRealTimers()` | |
| `tick(ms)` | `vi.advanceTimersByTime(ms)` | |
| `flush()` | `vi.runAllTimers()` | |
| `flushMicrotasks()` | `await Promise.resolve()` | Native microtask |
| `waitForAsync()` | `async / await` | |
| `RouterTestingModule` | `provideRouter([])` | |
| `HttpClientModule` | `provideHttpClient()` | |
| `innerText` | `textContent` | jsdom compatibility |

## Per-File Migration Status

| # | File | Status | Changes |
|---|------|--------|---------|
| 1 | `app.component.spec.ts` | ✅ | Spy syntax |
| 2 | `customers/customer-list/customers.component.spec.ts` | ✅ | Spy syntax |
| 3 | `customers/customers.store.spec.ts` | ✅ | `jasmine.createSpyObj` → `vi.fn()`, removed `fakeAsync`/`tick`, added default mock return |
| 4 | `demos/samples/component-async/async-intro.spec.ts` | ✅ | `fakeAsync`/`tick`/`flush`/`flushMicrotasks` → `vi.useFakeTimers()`/`vi.advanceTimersByTime()`/`vi.runAllTimers()`/`async/await` |
| 5 | `demos/samples/component-async/food-menu/food-menu.component.spec.ts` | ✅ | `fakeAsync`/`tick` → `vi.useFakeTimers()`/`vi.advanceTimersByTime()`, `waitForAsync` → real timer wait |
| 6 | `demos/samples/component-async/simple-auth-async-when-stable/simple-auth-when-stable.component.spec.ts` | ✅ | `waitForAsync` → `async/await`, spy before `detectChanges` |
| 7 | `demos/samples/component-async/simple-auth-done/simple-auth-done.component.spec.ts` | ✅ | `done` callback → sync test, `spyOn` → `vi.spyOn` |
| 8 | `demos/samples/component-async/simple-auth-fake-async/simple-auth-fake-async.component.spec.ts` | ✅ | `fakeAsync`/`tick` → `vi.useFakeTimers()`/`vi.advanceTimersByTime()` and sync |
| 9 | `demos/samples/component-class/component-class.component.spec.ts` | ✅ | Spy syntax |
| 10 | `demos/samples/component-events/component-events.component.spec.ts` | ✅ | Spy syntax, `innerText` → `textContent` |
| 11 | `demos/samples/component-input-signals/component-input-signals.component.spec.ts` | ✅ | No changes needed |
| 12 | `demos/samples/component-integration/food-list/food-list.component.spec.ts` | ✅ | `jasmine.createSpyObj` → `vi.fn()`, removed `fakeAsync` |
| 13 | `demos/samples/component-integration/food-row/food-row.component.spec.ts` | ✅ | Spy syntax |
| 14 | `demos/samples/component-marbles/marble-syntax.spec.ts` | ✅ | No changes needed (RxJS TestScheduler) |
| 15 | `demos/samples/component-marbles/marbles.component.spec.ts` | ✅ | `jasmine.createSpyObj` → `vi.fn()` |
| 16 | `demos/samples/component-marbles/person.service.spec.ts` | ✅ | No changes needed (RxJS TestScheduler) |
| 17 | `demos/samples/component-material-async/material-async.component.spec.ts` | ✅ | `waitForAsync` → `async/await`, `HttpClientModule` → `provideHttpClient()` |
| 18 | `demos/samples/component-material/material.component.spec.ts` | ✅ | Spy syntax |
| 19 | `demos/samples/component-mocking/auth.service.spec.ts` | ✅ | Spy syntax |
| 20 | `demos/samples/component-mocking/use-spy/use-spy.component.spec.ts` | ✅ | `jasmine.createSpyObj` → `vi.fn()` |
| 21 | `demos/samples/component-test/simple-food/simple-food.component.spec.ts` | ✅ | `jasmine.createSpyObj` → `vi.fn()` |
| 22 | `demos/samples/component-write/component-write.component.spec.ts` | ✅ | Spy syntax |
| 23 | `demos/samples/directive/capitalize.directive.spec.ts` | ✅ | Spy syntax |
| 24 | `demos/samples/food/food.service-bs.spec.ts` | ✅ | Spy syntax |
| 25 | `demos/samples/food/food.service.spec.ts` | ✅ | Spy syntax |
| 26 | `demos/samples/intro-unit-testing/simple-class.spec.ts` | ✅ | No changes needed |
| 27 | `demos/samples/intro-unit-testing/voucher-validator.spec.ts` | ✅ | No changes needed |
| 28 | `demos/samples/marble-testing/marble-testing.component.spec.ts` | ✅ | No changes needed (RxJS TestScheduler) |
| 29 | `demos/samples/ngrx-mockstore/mockstore/mockstore.component.spec.ts` | ✅ | Spy syntax |
| 30 | `demos/samples/pipe/phonenumber.pipe.spec.ts` | ✅ | No changes needed |
| 31 | `demos/samples/pipe/rating.pipe.spec.ts` | ✅ | Spy syntax |
| 32 | `demos/samples/simple-service/simple.service.spec.ts` | ✅ | Spy syntax, split multi-arg `toContain` |
| 33 | `demos/state/demos.state.spec.ts` | ✅ | Spy syntax |
| 34 | `shared/intro/intro.component.spec.ts` | ✅ | `RouterTestingModule` → `provideRouter([])` |
| 35 | `shared/loading/loading.service.spec.ts` | ✅ | Spy syntax |
| 36 | `shared/markdown-renderer/markdown-renderer.component.spec.ts` | ✅ | Spy syntax |
| 37 | `shared/navbar/navbar.service.spec.ts` | ✅ | Spy syntax |
| 38 | `shared/side-panel/side-panel.component.spec.ts` | ✅ | Spy syntax |
| 39 | `shared/side-panel/sidepanel.service.spec.ts` | ✅ | Spy syntax |
| 40 | `state/app.reducer.spec.ts` | ✅ | No changes needed |

## Best Practices Applied (per Angular Docs)

- **Zoneless TestBed**: zone.js removed from polyfills, TestBed runs zoneless by default
- **OnPush components**: All components use `ChangeDetectionStrategy.OnPush`
- **`await fixture.whenStable()`**: Preferred over manual `fixture.detectChanges()` where applicable
- **`vi.useFakeTimers()`**: Replaces zone.js `fakeAsync`/`tick` for timer control
- **Service mocking**: `vi.fn()` and `vi.spyOn()` for dependency isolation
- **No zone.js testing utilities**: `fakeAsync`, `tick`, `flush`, `flushMicrotasks`, `waitForAsync` all replaced
