# Container / Presenter — Customers

Integration-test `CustomersComponent` (container) with real child presenters.

## Spec file

Navigate to `integration-tests/` and examine the test file.

## Key Concepts

- Do NOT use `NO_ERRORS_SCHEMA` — import and render real child components
- `By.directive(ChildComp)` finds child component instances in the DOM tree
- Verify that signal inputs flow from container to presenter via `debugElement.componentInstance`
- Verify that output events from a presenter reach the container by subscribing to `componentInstance.output`
- Test the full component tree with real interactions
