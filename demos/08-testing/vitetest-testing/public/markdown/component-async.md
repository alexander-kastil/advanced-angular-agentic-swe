# Comp Async Customers — CustomersComponent

Test asynchronous loading behavior using `fakeAsync` and `tick`.

## Spec file

Navigate to `async/` and examine the test file.

## Key Concepts

- `fakeAsync` wraps the test function and gives synchronous control over timers
- `tick()` advances the virtual clock to process pending microtasks and timers
- Use writable signals in the fake store to simulate state changes
- Call `fixture.detectChanges()` after every signal mutation to trigger change detection
- Test progress bar visibility during loading, then verify data renders after `tick()`
