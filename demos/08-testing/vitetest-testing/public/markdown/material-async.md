# Material Async — CustomersTableComponent

Combine Material test harnesses with `async`/`await` to interact with Material components that have asynchronous rendering.

## Spec file

Navigate to `material-async/` and examine the test file.

## Key Concepts

- Material test harnesses work with async operations (animations, lazy rendering)
- Use `async (fixture)` test wrapper for async operations
- Call `await harness.method()` to wait for Material component state changes
- Material harnesses handle all async complexity internally
- Combine `fakeAsync`/`tick` with harnesses for full async control
