# Comp DOM Test — CustomersTableComponent

Test DOM rendering using `setInput()` for signal inputs and `By.css()` queries.

## Spec file

Navigate to `component-write/` and examine the test file.

## Key Concepts

- `fixture.componentRef.setInput()` sets signal inputs in tests
- `Testing.query(By.css())` returns `DebugElement` instances for DOM queries
- Call `fixture.detectChanges()` after every state mutation to trigger change detection
- Assert against `nativeElement.textContent` or `querySelector()` results
- Test both input signal DOM effects and output emissions
