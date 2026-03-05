# CRUD Customers — SimpleCustomersComponent

Test `SimpleCustomersComponent` which uses Angular's `resource()` API for data loading. Spy on `CustomersService` to control HTTP responses and verify add/delete interactions.

## Spec file

Navigate to `component-test/` and examine the test file.

## Key Concepts

- `vi.fn().mockReturnValue(of(data))` returns a synchronous observable for mocking service methods
- `resource()` is async so use `await fixture.whenStable()` before asserting component state
- After deleting, call `resource.reload()` to trigger another GET call
- Mock service methods to return controlled data, then assert component behavior
- Test component lifecycle: data load → render → user interaction → state update
