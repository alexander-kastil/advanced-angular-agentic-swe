# Comp Interaction — CustomersComponent

Test component interactions by triggering user events (button clicks, form inputs) and verifying that component methods are called and DOM updates correctly.

## Overview

Component interaction testing verifies:

1. User clicks buttons → component methods fire
2. Component methods update signals/state
3. DOM reflects new state (change detection)
4. Component calls store/service methods

## Setup

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { describe, it, expect, beforeEach } from "vitest";
import { ComponentEventsComponent } from "./component-events.component";

describe("ComponentEventsComponent Interactions", () => {
  let fixture: ComponentFixture<ComponentEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentEventsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentEventsComponent);
    fixture.detectChanges();
  });
});
```

## Testing Button Clicks with triggerEventHandler

```typescript
it("should increment count when Increment button is clicked", () => {
  // Query button by data-testid
  const btnClick = fixture.debugElement.query(By.css("[data-testid=btnIncrement]"));

  // Trigger click event using debugElement
  btnClick.triggerEventHandler("click", {});

  // Assert component state updated
  expect(fixture.componentInstance.count()).toBe(1);

  // Manually detect changes to render new value
  fixture.detectChanges();

  // Query result display element
  const divResult = fixture.debugElement.query(By.css("[data-testid=result]"));
  expect(divResult.nativeElement.textContent).toContain("1");
});
```

## Testing Button Clicks with Native API

```typescript
it("should increment count multiple times with native click", () => {
  const btnClick = fixture.debugElement.query(By.css("[data-testid=btnIncrement]"));

  // Native click (more realistic user interaction)
  btnClick.nativeElement.click();
  btnClick.nativeElement.click();

  // Verify count updated
  expect(fixture.componentInstance.count()).toBe(2);

  // Use autoDetectChanges to trigger change detection automatically
  fixture.autoDetectChanges();

  // Verify DOM reflects new value
  const divResult = fixture.debugElement.query(By.css("[data-testid=result]"));
  expect(divResult.nativeElement.textContent).toContain("2");
});
```

## Testing Input Changes

```typescript
it("should update name signal when input changes", () => {
  const input = fixture.debugElement.query(By.css("input[name=name]"));

  // Set input value
  input.nativeElement.value = "John Doe";

  // Dispatch input event
  input.nativeElement.dispatchEvent(new Event("input"));
  fixture.detectChanges();

  // Assert component signal updated
  expect(fixture.componentInstance.name()).toBe("John Doe");
});
```

## Testing Select/Dropdown Changes

```typescript
it("should update selected item when dropdown changes", () => {
  const select = fixture.debugElement.query(By.css("select"));

  // Set select value
  select.nativeElement.value = "2";

  // Dispatch change event
  select.nativeElement.dispatchEvent(new Event("change"));
  fixture.detectChanges();

  // Verify component state
  expect(fixture.componentInstance.selectedId()).toBe("2");
});
```

## Testing Component Method Calls

```typescript
it("should call deleteCustomer() when Delete button clicked", () => {
  // Spy on component method
  spyOn(fixture.componentInstance, "deleteCustomer");

  // Click delete button
  const deleteBtn = fixture.debugElement.query(By.css("[data-testid=btnDelete]"));
  deleteBtn.nativeElement.click();

  // Verify method was called
  expect(fixture.componentInstance.deleteCustomer).toHaveBeenCalled();
});
```

## Testing Custom Events

```typescript
it("should handle custom output event from child", () => {
  const component = fixture.componentInstance;
  spyOn(component.itemSelected, "emit");

  // Simulate selecting item
  component.selectItem({ id: 1, name: "John" });

  // Verify output emitted
  expect(component.itemSelected.emit).toHaveBeenCalledWith({ id: 1, name: "John" });
});
```

## Testing Multiple Interactions

```typescript
it("should handle full user flow: input → button → output", () => {
  // User types name
  const input = fixture.debugElement.query(By.css("input[name=name]"));
  input.nativeElement.value = "New Customer";
  input.nativeElement.dispatchEvent(new Event("input"));
  fixture.detectChanges();

  // User clicks Add button
  const addBtn = fixture.debugElement.query(By.css("[data-testid=btnAdd]"));
  addBtn.nativeElement.click();

  // Verify component called store method
  expect(fixture.componentInstance.store.add).toHaveBeenCalledWith("New Customer");

  // Verify DOM shows new item
  const items = fixture.debugElement.queryAll(By.css("[data-testid=item]"));
  expect(items.length).toBeGreaterThan(0);
});
```

## Testing Form Interactions

```typescript
it("should handle form submission", () => {
  const form = fixture.debugElement.query(By.css("form"));
  spyOn(fixture.componentInstance, "onSubmit");

  // Submit form
  form.nativeElement.dispatchEvent(new Event("submit"));

  // Verify submit handler called
  expect(fixture.componentInstance.onSubmit).toHaveBeenCalled();
});
```

## Testing DOM Visibility

```typescript
it("should show/hide elements based on state", () => {
  // Initially hidden
  let errorMsg = fixture.debugElement.query(By.css("[data-testid=error]"));
  expect(errorMsg).toBeFalsy();

  // Trigger error state
  fixture.componentInstance.error.set("Something went wrong");
  fixture.detectChanges();

  // Now visible
  errorMsg = fixture.debugElement.query(By.css("[data-testid=error]"));
  expect(errorMsg).toBeTruthy();
  expect(errorMsg.nativeElement.textContent).toContain("Something went wrong");
});
```

## Key Concepts

- **triggerEventHandler()** - Programmatic event trigger (faster, more controlled)
- **nativeElement.click()** - Native DOM click (more realistic user interaction)
- **fixture.detectChanges()** - Manually run Angular change detection
- **fixture.autoDetectChanges()** - Automatic change detection after each operation
- **By.css()** - Query elements using CSS selectors
- **dispatchEvent()** - Trigger input/change/custom events
- **spyOn()** - Verify component methods are called
- **Combine state checks + DOM checks** - Test both component logic and rendered output
