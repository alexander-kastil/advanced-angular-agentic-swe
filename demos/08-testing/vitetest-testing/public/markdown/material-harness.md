# Material Harness — CustomersTableComponent

Test Material components using **test harnesses** — a stable, high-level API that abstracts away DOM structure details. Harnesses let you interact with Material components the way users do, without coupling tests to HTML internals.

## Why Use Harnesses?

Instead of brittle DOM selectors:

```typescript
// Brittle: tightly coupled to DOM structure
const input = fixture.nativeElement.querySelector("input.mat-input-element");
input.value = "test";
input.dispatchEvent(new Event("input"));
```

Use harnesses:

```typescript
// Robust: abstracted API
const inputHarness = await loader.getHarness(MatInputHarness);
await inputHarness.setValue("test");
```

Harnesses survive Angular Material updates that change internal HTML — your tests don't break.

## Setup

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { MatButtonHarness } from "@angular/material/button/testing";
import { MatTableHarness } from "@angular/material/table/testing";
import { MatInputHarness } from "@angular/material/input/testing";
import { MatSliderHarness } from "@angular/material/slider/testing";

describe("MaterialComponent with Harnesses", () => {
  let fixture: ComponentFixture<MaterialComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule, // Disable animations for faster tests
        MaterialComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialComponent);
    fixture.detectChanges();

    // Create the harness loader
    loader = TestbedHarnessEnvironment.loader(fixture);
  });
});
```

## Testing Buttons

```typescript
it("should click Reset button and reset slider", async () => {
  // Get button by text label
  const resetBtn = await loader.getHarness(MatButtonHarness.with({ text: "Reset" }));

  // Click using harness API
  await resetBtn.click();

  // Verify result
  const slider = await loader.getHarness(MatSliderHarness);
  const value = await slider.getValue();
  expect(value).toBe(0);
});

it("should find multiple buttons by partial text", async () => {
  const deleteButtons = await loader.getAllHarnesses(MatButtonHarness.with({ text: /Delete/ }));
  expect(deleteButtons.length).toBeGreaterThan(0);
});
```

## Testing Input Fields

```typescript
it("should get and set input value", async () => {
  const input = await loader.getHarness(MatInputHarness);

  // Get current value
  const initialValue = await input.getValue();
  expect(initialValue).toBe("Sushi");

  // Set new value
  await input.setValue("Pizza");

  // Verify new value
  const newValue = await input.getValue();
  expect(newValue).toBe("Pizza");
});

it("should show error message when input is invalid", async () => {
  const input = await loader.getHarness(MatInputHarness);
  await input.setValue("");

  // Check if error appears
  const errorText = await input.getErrorText();
  expect(errorText).toContain("required");
});
```

## Testing Tables

```typescript
it("should render customer table with data", async () => {
  const table = await loader.getHarness(MatTableHarness);

  // Get all rows
  const rows = await table.getRows();
  expect(rows.length).toBe(3);

  // Get cells from first row
  const firstRow = rows[0];
  const cells = await firstRow.getCells();
  const firstCell = await cells[0].getText();
  expect(firstCell).toContain("John");
});

it("should get table headers", async () => {
  const table = await loader.getHarness(MatTableHarness);

  const headerRows = await table.getHeaderRows();
  const headerCells = await headerRows[0].getCells();
  const firstHeader = await headerCells[0].getText();
  expect(firstHeader).toContain("Name");
});
```

## Testing Sliders

```typescript
it("should set slider value", async () => {
  const slider = await loader.getHarness(MatSliderHarness);

  // Get start and end thumbs
  const startThumb = await slider.getStartThumb();
  const endThumb = await slider.getEndThumb();

  // Set values
  await endThumb.setValue(75);

  // Get new value
  const newValue = await slider.getValue();
  expect(newValue).toBe(75);
});
```

## Filtering Harnesses

```typescript
// Find button with exact text match
const saveBtn = await loader.getHarness(MatButtonHarness.with({ text: "Save" }));

// Find button with partial text match
const deleteBtn = await loader.getHarness(MatButtonHarness.with({ text: /Delete/ }));

// Find input by label
const emailInput = await loader.getHarness(MatInputHarness.with({ selector: '[aria-label="Email"]' }));

// Find input by aria-label
const passwordInput = await loader.getHarness(MatInputHarness.with({ label: "Password" }));
```

## Advanced: Multiple Harnesses

```typescript
it("should interact with form harnesses", async () => {
  // Get all inputs in form
  const inputs = await loader.getAllHarnesses(MatInputHarness);

  // Fill them in
  await inputs[0].setValue("John");
  await inputs[1].setValue("john@example.com");

  // Submit
  const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: "Submit" }));
  await submitBtn.click();

  // Verify success
  const successMsg = fixture.debugElement.query(By.css(".success"));
  expect(successMsg).toBeTruthy();
});
```

## Key Concepts

- **TestbedHarnessEnvironment.loader(fixture)** - Creates harness loader for the component fixture
- **loader.getHarness(HarnessClass)** - Gets a single harness instance (throws if multiple match)
- **loader.getAllHarnesses(HarnessClass)** - Gets all matching harnesses
- **HarnessClass.with(filters)** - Filters by text, label, selector, or other properties
- **await harness.click()** / **setValue()** / **getValue()** - Interact with component through harness API
- **Decoupled from DOM** - Tests survive Material CSS/HTML refactors
- **Matches user interactions** - Harness methods correspond to user actions (click, type, etc.)
