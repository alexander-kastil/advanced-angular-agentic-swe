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

## Reading and writing the DOM

The demo renders two things: an input bound with `ngModel`, and a counter driven by a click.

Write into an input and assert the component state:

```typescript
const input = fixture.debugElement.query(By.css("[data-testid=username]"));
const el = input.nativeElement as HTMLInputElement;
el.value = "Soi the Whippet";
el.dispatchEvent(new Event("input"));

expect(fixture.componentInstance.user().username).toBe("Soi the Whippet");
```

## Firing click events

Two ways, both in `counter.component.spec.ts`:

```typescript
const btn = fixture.debugElement.query(By.css("[data-testid=btnIncrement]"));

btn.triggerEventHandler("click", {});
btn.nativeElement.click();
```

`triggerEventHandler` calls the bound handler directly and never leaves Angular. `nativeElement.click()` dispatches a real DOM event, which is closer to what a user does. Both need change detection before you read the rendered text:

```typescript
fixture.detectChanges();
const result = fixture.debugElement.query(By.css("[data-testid=result]"));
expect(result.nativeElement.textContent).toContain("1");
```

`fixture.autoDetectChanges()` keeps the fixture in sync for the rest of the test, which is convenient in a zoneless app.
