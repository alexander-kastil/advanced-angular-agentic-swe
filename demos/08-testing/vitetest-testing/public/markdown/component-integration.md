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

## Wiring: outputs travel up, inputs travel down

The interaction half of this demo lives in `customers-interaction.spec.ts` and `customers-integration.spec.ts`. Emit from the real child instance and assert the container reacted:

```typescript
const table = fixture.debugElement.query(By.directive(CustomersTableComponent));

table.componentInstance.edit.emit(mockCustomers[1]);
expect(storeSpy.selectCustomer).toHaveBeenCalledWith(mockCustomers[1]);

table.componentInstance.delete.emit(2);
expect(storeSpy.deleteCustomer).toHaveBeenCalledWith(2);
```

And in the other direction, read the input signal off the child:

```typescript
expect(table.componentInstance.customers()).toEqual(mockCustomers);
```

Let the spy actually move the state so the next assertion sees the new tree:

```typescript
selectCustomer: vi.fn().mockImplementation((c) => selectedCustomer.set(c)),
```

That is what makes `@if (store.selectedCustomer())` render `app-customer-edit` mid-test.
