# Playwright E2E Testing

Write end-to-end tests with Playwright using the Page Object Model and fixtures. Reset API state between tests for full isolation.

Playwright tests live in `e2e/` alongside the app.

## Key Concepts

### Page Object Model (POM)

Encapsulate page interactions in a class so tests stay readable and locators are maintained in one place.

```typescript
export class CustomersPage {
  constructor(private page: Page) {}

  editButton(rowName: string | RegExp) {
    return this.page.getByRole("row", { name: rowName }).getByRole("button").first();
  }

  async fillName(name: string) {
    await this.page.getByRole("textbox", { name: "Name" }).fill(name);
  }

  async save() {
    await this.page.getByRole("button", { name: "Save" }).click();
    await this.page.waitForLoadState("networkidle");
  }
}
```

### Fixtures

Extend Playwright's `test` with custom fixtures to inject the POM and reset state before each test.

```typescript
export const test = base.extend<{ customersPage: CustomersPage }>({
  customersPage: async ({ page, request }, use) => {
    await resetCustomers(request); // reset json-server via API
    const cp = new CustomersPage(page);
    await cp.goto();
    await use(cp);
  },
});
```

### API Reset for Isolation

Each test gets a clean slate by deleting and re-seeding data through the REST API before it runs.

```typescript
async function resetCustomers(request: APIRequestContext) {
  const existing = await (await request.get(`${API}/customers`)).json();
  for (const c of existing) {
    await request.delete(`${API}/customers/${c.id}`);
  }
  for (const c of INITIAL_CUSTOMERS) {
    await request.post(`${API}/customers`, { data: c });
  }
}
```

### Writing Tests

```typescript
import { test, expect } from "./customers.fixture";

test("updates the row after save", async ({ customersPage }) => {
  await customersPage.editButton(/Cleo/).click();
  await customersPage.fillName("Cleo Updated");
  await customersPage.save();

  await customersPage.expectRowVisible("Cleo Updated");
  await customersPage.expectRowHidden("Cleo");
});
```

### Network Mocking

`page.route()` intercepts a request before it leaves the browser, so a state that is awkward to produce for real (empty list, 500) becomes a one-liner. Install the route before navigating, and match the full API URL so the app's own document request is not caught by the glob.

```typescript
await page.route(`${API}/customers`, (route) => route.fulfill({ json: [{ id: 1, name: "Mocked Ada" }] }));
await page.route(`${API}/customers`, (route) => route.fulfill({ status: 500, json: { message: "boom" } }));
```

### Asserting on Requests and Responses

`page.waitForResponse()` returns the response object, so the test can assert the method, the status and the body the app actually sent. Listening on `page.on('request')` proves the opposite: that cancel writes nothing.

```typescript
const [response] = await Promise.all([
  page.waitForResponse((r) => r.url().startsWith(`${API}/customers/`) && r.request().method() === "PUT"),
  customersPage.save(),
]);

expect(response.ok()).toBe(true);
expect(response.request().postDataJSON()).toMatchObject({ name: "Cleo Renamed" });
```

### Keyboard Interaction

`fill()` sets a value in one shot. `press()` and `pressSequentially()` go through real key events, which is how you test shortcuts, Enter-to-submit and validation that reacts to each keystroke.

```typescript
await customersPage.nameInput().press("ControlOrMeta+a");
await customersPage.nameInput().pressSequentially("Giro Typed");
await customersPage.nameInput().press("Enter");

await expect(customersPage.nameInput()).toBeFocused();
```

### Steps and Soft Assertions

`test.step()` groups actions into named blocks that show up in the report and the trace viewer. `expect.soft()` records a failure and keeps going, so one run reports every wrong row instead of only the first.

```typescript
await test.step("open the empty form", async () => {
  await customersPage.addButton().click();
  await customersPage.expectFormVisible();
});

await expect.soft(customersPage.row(/Cleo/)).toBeVisible();
await expect.soft(customersPage.row(/Soi/)).toBeVisible();
```

### API Request Context

The `request` fixture talks to the backend directly, with no browser involved. Use it to assert that a UI action reached the server, or to seed data and then reload the page.

```typescript
await customersPage.deleteButton(/Giro/).click();

const remaining = await (await request.get(`${API}/customers`)).json();
expect(remaining.map((c) => c.name)).not.toContain("Giro");
```

## Running

`@playwright/test` is a devDependency of this app. `playwright.config.ts` sets `testDir: './e2e'`, `tsconfig: './tsconfig.e2e.json'` and a `webServer` that starts `ng serve` for you and reuses a running one.

```bash
# Download the browser (first time, machine wide)
npx playwright install chromium

# json-server, because the fixture resets state through the API
npm run api

# Run all e2e tests
npm run e2e

# Interactive UI mode
npx playwright test --ui
```

Without `tsconfig.e2e.json` the `e2e/` folder belongs to no build: `tsconfig.app.json` starts at `src/main.ts` and `tsconfig.spec.json` collects `src/**/*.spec.ts`. The files still ran, but a type error in a page object stayed invisible until the assertion failed.
