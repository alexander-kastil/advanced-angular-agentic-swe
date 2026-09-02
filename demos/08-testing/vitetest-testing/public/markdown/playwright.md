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
