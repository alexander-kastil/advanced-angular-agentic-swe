# Test Signal Store — markdownEditorStore

Test the `markdownEditorStore` directly by dispatching events via the NgRx Dispatcher.

## Spec file

Navigate to `test-signals-store/` and examine the test file.

## Key Concepts

- Inject the store and `Dispatcher` directly in TestBed
- Mock the service with `vi.fn()` returning `of(data)` observables
- Call `TestBed.flushEffects()` to trigger `onInit` hooks and event handlers synchronously
- Dispatch events manually via `store.dispatch()` to drive state transitions
- Assert store state via `store.entities()`, `store.isLoading()`, `store.error()` after dispatch
