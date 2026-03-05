# Comp Spy — CustomersComponent

Test `CustomersComponent` by mocking the store dependency with spy functions (`vi.fn()`). This isolates component logic from store implementation, making tests fast and deterministic.

## Why Mock the Store?

The store may have complex initialization, effects, or HTTP calls. Testing the component in isolation with a mock store:

- Runs tests fast (no async operations)
- Focuses on component behavior, not store behavior
- Allows you to control what the store returns
- Verifies the component calls the store methods correctly

## Setup with Mock Store

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { CustomersComponent } from "./customers.component";
import { CustomersStore } from "./customers.store";
import { signal } from "@angular/core";

describe("CustomersComponent with Mocked Store", () => {
  let component: CustomersComponent;
  let fixture: ComponentFixture<CustomersComponent>;
  let mockStore: any;

  beforeEach(async () => {
    // Create mock store with signal properties and vi.fn() methods
    mockStore = {
      // Mock signal properties
      customers: signal([]),
      loading: signal(false),
      error: signal(null),

      // Mock store methods with vi.fn()
      load: vi.fn(),
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      reload: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CustomersComponent],
      providers: [{ provide: CustomersStore, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
```

## Testing Component Methods Call Store

```typescript
it("should call store.load() when component initializes", () => {
  expect(mockStore.load).toHaveBeenCalled();
});

it("should call store.add() with new customer data", () => {
  const newCustomer = { name: "Alice", email: "alice@example.com" };

  component.addCustomer(newCustomer);

  expect(mockStore.add).toHaveBeenCalledWith(newCustomer);
});

it("should call store.update() with customer ID and updates", () => {
  const customerId = 1;
  const updates = { name: "Updated Name" };

  component.updateCustomer(customerId, updates);

  expect(mockStore.update).toHaveBeenCalledWith(customerId, updates);
});

it("should call store.delete() with customer ID", () => {
  const customerId = 5;

  component.deleteCustomer(customerId);

  expect(mockStore.delete).toHaveBeenCalledWith(customerId);
});
```

## Testing Components Reacts to Store State

```typescript
it("should display customers from store", () => {
  mockStore.customers = signal([
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
  ]);

  fixture.detectChanges();

  const rows = fixture.debugElement.queryAll(By.css("mat-row"));
  expect(rows.length).toBe(2);
});

it("should show loading spinner when store is loading", () => {
  mockStore.loading = signal(true);

  fixture.detectChanges();

  const spinner = fixture.debugElement.query(By.css("mat-spinner"));
  expect(spinner).toBeTruthy();
});

it("should show error message when store has error", () => {
  mockStore.error = signal("Failed to load customers");

  fixture.detectChanges();

  const errorMsg = fixture.debugElement.query(By.css("[data-testid=error]"));
  expect(errorMsg.nativeElement.textContent).toContain("Failed to load");
});
```

## Advanced: Testing Multiple Calls

```typescript
it("should reload after successful delete", () => {
  component.deleteCustomer(1);

  expect(mockStore.delete).toHaveBeenCalledWith(1);
  expect(mockStore.reload).toHaveBeenCalled();
});

it("should not call reload if delete fails", () => {
  mockStore.delete.mockImplementationOnce(() => {
    throw new Error("Delete failed");
  });

  expect(() => component.deleteCustomer(1)).toThrow();
  expect(mockStore.reload).not.toHaveBeenCalled();
});
```

## Key Concepts

- **Mock signal properties** - Use `signal()` for store state variables that the component reads
- **Mock methods with vi.fn()** - Create spy functions for store methods the component calls
- **toHaveBeenCalledWith()** - Assert that a method was called with expected arguments
- **toHaveBeenCalled()** - Assert a method was invoked at least once
- **No HttpClient** - The mock store eliminates HTTP calls, making tests deterministic
- **No store initialization** - Component tests don't depend on complex store setup
- **Verify integration** - This tests that component correctly calls and uses store methods
