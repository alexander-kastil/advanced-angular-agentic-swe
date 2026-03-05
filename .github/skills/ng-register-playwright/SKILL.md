---
name: ng-register-playwright
description: Step-by-step guide for implementing Playwright E2E testing in Angular v20+ projects. Covers installation, configuration, test organization with fixtures and page objects, and best practices for modern standalone components with Vitest and Playwright integration.
---

# Register Playwright for E2E Testing in Angular

## Overview

This skill guides coding agents through setting up **Playwright E2E testing** in Angular v20+ projects. Playwright is a modern browser automation framework supporting Chromium, Firefox, and WebKit. It integrates seamlessly with Angular applications running on `ng serve` and works alongside Vitest for unit tests.

**Key Benefits:**

- ✅ **Fast Execution** – Parallel test runs across multiple browsers
- ✅ **Modern API** – Async/await native, no callbacks or promises
- ✅ **Powerful Tooling** – Inspector, trace viewer, and HTML reporter
- ✅ **Fixture-Based Testing** – Reusable test setup and teardown
- ✅ **Page Objects** – Encapsulation of UI interactions
- ✅ **Network Control** – Intercept, mock, and monitor API calls
- ✅ **Cross-Browser** – Single configuration for Chrome, Firefox, Safari

**Target Environment:**

- Angular v20.2+
- Node.js 20+
- Vitest (optional but recommended for unit testing alongside E2E)
- JSON Server or similar backend (for API mocking/interaction)

---

## Prerequisites

Before starting, verify:

1. **Angular project is initialized** (`ng version` shows v20+)
2. **Development server works** (`ng serve` runs without errors)
3. **Git is initialized** (to track changes)
4. **Backend mock server available** (optional but recommended for testing)

Check Angular version:

```bash
ng version
# Output should show: Angular: 20.x or 21.x
```

---

## Step 1: Install Playwright Dependencies

### 1a. Install Playwright packages

```bash
npm install --save-dev @playwright/test
```

### 1b. Install Playwright browsers

After installation, install browser binaries:

```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit binaries (~300MB total).

### 1c. Verify installation

```bash
npm list @playwright/test
npx playwright --version
```

**Expected output:** `@playwright/test@^1.x.x` and version number displayed

---

## Step 2: Create Playwright Configuration

Create file at project root: `playwright.config.ts`

### 2a. Basic configuration

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: process.env['CI'] ? true : false,
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'ng serve',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
  },
});
```

**Key Configuration Options:**

| Option          | Purpose                                        |
| --------------- | ---------------------------------------------- |
| `testDir`       | Directory containing test files (`./e2e`)      |
| `testMatch`     | Pattern for test files (`**/*.spec.ts`)        |
| `fullyParallel` | Run all tests in parallel across workers       |
| `retries`       | Number of retries for failed tests             |
| `reporter`      | HTML report generation after test runs         |
| `baseURL`       | Base URL for all navigation (`localhost:4200`) |
| `trace`         | Record trace for debugging (`on-first-retry`)  |
| `screenshot`    | Screenshot on failure only                     |
| `webServer`     | Launch dev server automatically before tests   |

### 2b. Multi-browser configuration (optional)

To test across Chromium, Firefox, and WebKit:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  use: {
    baseURL: 'http://localhost:4200',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

---

## Step 3: Create E2E Directory Structure

### 3a. Create e2e folder with test files

```bash
mkdir -p e2e
touch e2e/example.spec.ts
```

### 3b. Recommended folder structure

```
e2e/
├── fixtures/
│   ├── example.fixture.ts
│   └── api.fixture.ts
├── pages/
│   └── example.page.ts
├── interactions/
│   └── example.interaction.ts
└── example.spec.ts
```

**Roles:**

- **`fixtures/`** – Reusable test setup (API reset, page initialization)
- **`pages/`** – Page Object Model/Page Helper classes
- **`interactions/`** – Interaction scripts (smoke tests, multi-step workflows)
- **`*.spec.ts`** – Actual test suites

---

## Step 4: Create Fixtures for Test Setup

Fixtures encapsulate test setup and teardown, promoting reusability and reducing boilerplate.

### 4a. Basic test fixture

Create `e2e/example.fixture.ts`:

```typescript
import { test as base, expect, type Page } from '@playwright/test';

export class ExamplePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/example');
    await this.page.waitForLoadState('networkidle');
  }

  async fillInput(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  async clickButton(label: string | RegExp) {
    await this.page.getByRole('button', { name: label }).click();
  }

  async expectVisible(text: string | RegExp) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async expectHidden(text: string | RegExp) {
    await expect(this.page.getByText(text)).not.toBeVisible();
  }
}

export const test = base.extend<{ examplePage: ExamplePage }>({
  examplePage: async ({ page }, use) => {
    const examplePage = new ExamplePage(page);
    await examplePage.goto();
    await use(examplePage);
  },
});

export { expect };
```

**Fixture Pattern:**

1. Create a **Page Object Class** (e.g., `ExamplePage`) that wraps Playwright Page
2. Define methods for common interactions (goto, fill, click, assertions)
3. Use `test.extend()` to create a custom test fixture
4. Inject a new instance before each test via async factory function
5. Export both `test` and `expect`

### 4b. Fixture with API interaction

For applications that need backend state reset:

Create `e2e/api.fixture.ts`:

```typescript
import { test as base, expect, type APIRequestContext, type Page } from '@playwright/test';

const API = 'http://localhost:3000';

const INITIAL_DATA = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];

async function resetData(request: APIRequestContext) {
  // Fetch existing data
  const existing = await (await request.get(`${API}/data`)).json();

  // Delete all
  for (const item of existing) {
    await request.delete(`${API}/data/${item.id}`);
  }

  // Recreate initial state
  for (const item of INITIAL_DATA) {
    await request.post(`${API}/data`, { data: item });
  }
}

export class DataPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/data');
    await this.page.waitForLoadState('networkidle');
  }

  listItems() {
    return this.page.getByRole('row');
  }

  addButton() {
    return this.page.getByRole('button', { name: /add/i });
  }

  async expectItemVisible(name: string | RegExp) {
    await expect(this.page.getByRole('row', { name })).toBeVisible();
  }
}

export const test = base.extend<{ dataPage: DataPage }>({
  dataPage: async ({ page, request }, use) => {
    // Reset API state before test
    await resetData(request);

    // Create and use page object
    const dataPage = new DataPage(page);
    await dataPage.goto();
    await use(dataPage);
  },
});

export { expect };
```

---

## Step 5: Create Page Object Helpers

Page Objects encapsulate UI element selectors and interaction logic, improving test maintainability.

### 5a. Comprehensive page object example

Create `e2e/pages/customers.page.ts`:

```typescript
import { Page, Locator, expect } from '@playwright/test';

export class CustomersPage {
  constructor(private page: Page) {}

  /**
   * Navigation
   */
  async goto() {
    await this.page.goto('/customers');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Elements
   */
  table(): Locator {
    return this.page.locator('table');
  }

  row(name: string | RegExp): Locator {
    return this.page.getByRole('row', { name });
  }

  editButton(name: string | RegExp): Locator {
    return this.row(name).getByRole('button', { name: /edit/i });
  }

  deleteButton(name: string | RegExp): Locator {
    return this.row(name).getByRole('button', { name: /delete/i });
  }

  nameInput(): Locator {
    return this.page.getByRole('textbox', { name: /name/i });
  }

  saveButton(): Locator {
    return this.page.getByRole('button', { name: /save/i });
  }

  cancelButton(): Locator {
    return this.page.getByRole('button', { name: /cancel/i });
  }

  form(): Locator {
    return this.page.locator('form');
  }

  /**
   * Actions
   */
  async fillName(value: string) {
    await this.nameInput().fill(value);
  }

  async save() {
    await this.saveButton().click();
    await this.page.waitForLoadState('networkidle');
  }

  async cancel() {
    await this.cancelButton().click();
  }

  /**
   * Assertions
   */
  async expectRowVisible(name: string | RegExp) {
    await expect(this.row(name)).toBeVisible();
  }

  async expectRowHidden(name: string | RegExp) {
    await expect(this.row(name)).not.toBeVisible();
  }

  async expectFormVisible() {
    await expect(this.form()).toBeVisible();
  }

  async expectFormHidden() {
    await expect(this.form()).not.toBeVisible();
  }

  async expectTableContains(count: number) {
    const rows = this.page.getByRole('row').filter({ has: this.page.locator('td') });
    await expect(rows).toHaveCount(count);
  }
}
```

**Page Object Pattern:**

- **Private field:** `private page: Page` for encapsulation
- **Public element methods:** Return `Locator` without executing
- **Public action methods:** Perform interactions (click, fill, navigate)
- **Public assertion methods:** Validate expected state
- **Semantic naming:** `editButton()`, `saveButton()` reflect UI intent
- **Flexible selectors:** Use `getByRole()` for accessibility, filter by text/attributes

---

## Step 6: Write Test Suites

Test suites use fixtures and page objects for clean, maintainable tests.

### 6a. Simple test suite

Create `e2e/example.spec.ts`:

```typescript
import { test, expect, ExamplePage } from './example.fixture';

test.describe('Example Feature', () => {
  test('displays example page on navigation', async ({ examplePage }) => {
    // Fixture already called goto() and networkidle
    await expect(examplePage.page).toHaveTitle(/Example/);
  });

  test('shows list of items', async ({ examplePage }) => {
    const items = await examplePage.listItems();
    expect(items.length).toBeGreaterThan(0);
  });

  test('can add new item', async ({ examplePage }) => {
    await examplePage.clickButton('Add Item');
    await examplePage.fillInput('[name="title"]', 'New Item');
    await examplePage.clickButton('Save');

    await examplePage.expectVisible('New Item');
  });
});
```

### 6b. Comprehensive test suite with API fixture

Create `e2e/customers.spec.ts`:

```typescript
import { test, expect, CustomersPage } from './customers.fixture';

test.describe('Customers — Display', () => {
  test('shows all customers on load', async ({ customersPage }) => {
    await customersPage.expectRowVisible('Cleo');
    await customersPage.expectRowVisible('Soi');
    await customersPage.expectRowVisible('Giro');
  });

  test('table has correct headers', async ({ customersPage }) => {
    const table = customersPage.table();
    await expect(table.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  });
});

test.describe('Customers — Edit', () => {
  test('opens edit form when edit button clicked', async ({ customersPage }) => {
    await customersPage.editButton(/Cleo/).click();
    await customersPage.expectFormVisible();
    await expect(customersPage.nameInput()).toHaveValue('Cleo');
  });

  test('updates row after save', async ({ customersPage }) => {
    await customersPage.editButton(/Cleo/).click();
    await customersPage.fillName('Cleo Updated');
    await customersPage.save();

    await customersPage.expectRowVisible('Cleo Updated');
    await customersPage.expectRowHidden('Cleo');
    await customersPage.expectFormHidden();
  });

  test('discards changes on cancel', async ({ customersPage }) => {
    await customersPage.editButton(/Soi/).click();
    await customersPage.fillName('Soi Changed');
    await customersPage.cancel();

    await customersPage.expectFormHidden();
    await customersPage.expectRowVisible('Soi');
    await customersPage.expectRowHidden('Soi Changed');
  });
});

test.describe('Customers — Delete', () => {
  test('removes customer from table', async ({ customersPage }) => {
    await customersPage.expectRowVisible('Giro');
    await customersPage.deleteButton(/Giro/).click();
    await customersPage.page.waitForLoadState('networkidle');

    await customersPage.expectRowHidden('Giro');
  });

  test('updates row count after delete', async ({ customersPage }) => {
    // Initial count (from fixture reset)
    await customersPage.expectTableContains(4);

    await customersPage.deleteButton(/Flora/).click();
    await customersPage.page.waitForLoadState('networkidle');

    await customersPage.expectTableContains(3);
  });
});

test.describe('Customers — Error Handling', () => {
  test('shows error message on network failure', async ({ customersPage, page }) => {
    // Simulate network error on save
    await page.route('**/api/customers/**', route => route.abort());

    await customersPage.editButton(/Cleo/).click();
    await customersPage.fillName('Cleo Error Test');
    await customersPage.save();

    await expect(page.getByText(/error|failed/i)).toBeVisible();
  });
});
```

---

## Step 7: Create Interaction Scripts (Optional)

Interaction scripts are **not test assertions** but sequential step-by-step walkthroughs useful for smoke testing or documentation.

Create `e2e/customers.interaction.ts`:

```typescript
/**
 * Customers interaction script — mirrors the manual workflow.
 * Not a test suite: sequential steps to smoke-test the full customer workflow.
 * Run with: npx playwright test e2e/customers.interaction.ts --headed
 */

import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Step 1: Navigate
    await page.goto('http://localhost:4200/customers');
    await page.waitForLoadState('networkidle');
    console.log('✔ Customers page loaded');

    // Step 2: Edit
    const cleoRow = page.getByRole('row', { name: /Cleo/ });
    await cleoRow.getByRole('button').first().click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Cleo Updated');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForLoadState('networkidle');
    console.log('✔ Edited Cleo → Cleo Updated');

    // Step 3: Delete
    const updatedRow = page.getByRole('row', { name: /Cleo Updated/ });
    await updatedRow.getByRole('button').last().click();
    await page.waitForLoadState('networkidle');
    console.log('✔ Deleted Cleo Updated');

    // Step 4: Add
    await page.getByRole('button', { name: /add/i }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('New Customer');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForLoadState('networkidle');
    console.log('✔ Added new customer');

    console.log('\n✅ All interactions completed successfully');
  } catch (error) {
    console.error('❌ Interaction failed:', error);
  } finally {
    await browser.close();
  }
})();
```

Run interaction script in headed mode:

```bash
npx playwright test e2e/customers.interaction.ts --headed
```

---

## Step 8: Configure npm Scripts

Update `package.json` with E2E test commands:

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "e2e:debug": "playwright test --debug",
    "e2e:headed": "playwright test --headed",
    "e2e:chromium": "playwright test --project=chromium",
    "e2e:firefox": "playwright test --project=firefox",
    "e2e:webkit": "playwright test --project=webkit"
  }
}
```

**Command Reference:**

| Command                | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `npm run e2e`          | Run all tests in headless mode                |
| `npm run e2e:ui`       | Interactive UI mode (pause, slow-mo, inspect) |
| `npm run e2e:debug`    | Debug mode with inspector                     |
| `npm run e2e:headed`   | Run in visible browser windows                |
| `npm run e2e:chromium` | Run on Chromium only                          |

---

## Step 9: Run Tests and Validate

### 9a. Start development server (if not using webServer)

In one terminal:

```bash
ng serve
```

### 9b. Run E2E tests in new terminal

```bash
npm run e2e
```

### 9c. Expected output

```
Running 12 tests using 1 worker
...
  ✓ e2e/customers.spec.ts:10:3 › Customers — Display › shows all customers on load (2.1s)
  ✓ e2e/customers.spec.ts:15:3 › Customers — Display › table has correct headers (1.8s)
  ✓ e2e/customers.spec.ts:21:3 › Customers — Edit › opens edit form (1.9s)
  ...

12 passed (8.4s)
To open the last HTML report run: npx playwright show-report
```

### 9d. View HTML report

```bash
npx playwright show-report
```

Opens interactive report with video recordings, traces, and screenshots.

### 9e. Run in UI mode (recommended for development)

```bash
npm run e2e:ui
```

Launches Playwright Inspector with controls for step-through debugging.

---

## Step 10: Advanced Configuration

### 10a. Network interception and mocking

Mock API responses without needing backend:

```typescript
test('handles API error gracefully', async ({ page, customersPage }) => {
  // Mock failed request response
  await page.route('/api/customers', route => {
    route.abort('failed');
  });

  await customersPage.goto();

  await expect(page.getByText(/error|no data/i)).toBeVisible();
});

test('displays mock data', async ({ page, customersPage }) => {
  // Mock successful response
  await page.route('/api/customers', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Mock Customer' },
      ]),
    });
  });

  await customersPage.goto();
  await customersPage.expectRowVisible(/Mock Customer/);
});
```

### 10b. Authentication fixture

For protected routes:

```typescript
import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Perform login once per test
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Page is now authenticated
    await use(page);
  },
});
```

### 10c. Custom reporters

Generate reports in different formats:

```typescript
export default defineConfig({
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }],
    ['list'], // Console output
  ],
});
```

---

## Step 11: CI/CD Integration

### 11a. GitHub Actions example

Create `.github/workflows/e2e.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - run: npx playwright install --with-deps

      - run: npm run build

      - run: npm run e2e

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### 11b. GitLab CI example

Create `.gitlab-ci.yml`:

```yaml
e2e-tests:
  image: mcr.microsoft.com/playwright:v1-focal
  script:
    - npm ci
    - npm run build
    - npm run e2e
  artifacts:
    when: always
    paths:
      - playwright-report/
    expire_in: 30 days
```

---

## Best Practices

### ✅ Dos

- **Use fixtures** for setup/teardown (API reset, authentication, page initialization)
- **Use Page Objects** to encapsulate selectors and interactions
- **Use semantic locators** (`getByRole`, `getByLabel`) for accessibility
- **Wait for network** with `waitForLoadState('networkidle')`
- **Assertions separate from actions** – one assertion per test or related assertions
- **Meaningful test names** – describe behavior, not implementation
- **Screenshot/trace on failure** – configured in playwright.config.ts
- **Parallel tests** – Playwright runs tests concurrently by default
- **CI retries** – Set 1-2 retries in CI to handle flaky tests

```typescript
// ✅ Good: Clear, behavior-focused test
test('updates customer name and persists to server', async ({ customersPage }) => {
  await customersPage.editButton(/Alice/).click();
  await customersPage.fillName('Alice Updated');
  await customersPage.save();

  await customersPage.expectRowVisible('Alice Updated');
  await customersPage.expectRowHidden('Alice');
});
```

### ❌ Avoids

- **Hard waits** – Use `waitForLoadState()`, `waitForSelector()`, or expect with timeout
- **Sleeping** – `setTimeout()` in tests makes them slow and flaky
- **Implementation details** – Test behavior, not internal state
- **Multiple test responsibilities** – One test = one scenario
- **Overlapping test state** – Use fixtures for isolation
- **Hardcoded delays** – Use proper wait strategies

```typescript
// ❌ Bad: Hard-coded waits and implementation details
test('updates customer', async ({ page }) => {
  await page.goto('/customers');
  await page.waitForTimeout(500); // ❌ Hard wait

  await page.click('button:has-text("Edit")');
  await page.waitForTimeout(300); // ❌ Hard wait

  await page.fill('input#name', 'New Name');
  await page.click('button:has-text("Save")');
});
```

### 🎯 Naming Conventions

**Test Suites:**

```typescript
test.describe('Feature — Responsibility', () => {
  // Display tests
  test.describe('Display', () => { });

  // Interaction tests
  test.describe('Interaction', () => { });

  // Error handling tests
  test.describe('Error Handling', () => { });
});
```

**Page Objects:**

```typescript
export class CustomerPage {
  // Element methods (return Locator)
  nameInput(): Locator { }
  saveButton(): Locator { }

  // Action methods (perform interaction)
  async fillName(value: string) { }
  async save() { }

  // Assert methods (validate state)
  async expectNameToBe(value: string) { }
}
```

---

## Troubleshooting Common Issues

### Issue 1: Tests Timeout

**Symptom:** `Timeout 30000ms exceeded`

**Solution:**

1. Check dev server is running: `ng serve` in separate terminal
2. Increase timeout in config: `timeout: 60000` (in config or per test)
3. Use explicit waits: `await page.waitForLoadState('networkidle')`
4. Check `baseURL` matches dev server: `http://localhost:4200`

```typescript
// Increase timeout for specific test
test('slow operation', async ({ customersPage }) => {
  test.setTimeout(60000); // 60 seconds

  await customersPage.goto();
  // ... slow operations
});
```

### Issue 2: Selector Not Found

**Symptom:** `Locator.click: Target page, context or browser has been closed`

**Solution:**

1. Use `--headed` mode to debug: `npm run e2e:headed`
2. Use `--debug` mode with inspector: `npm run e2e:debug`
3. Use semantic locators (role-based):

```typescript
// ❌ Fragile
await page.click('.btn'); // What's this button?

// ✅ Robust
await page.getByRole('button', { name: /save/i }).click(); // Clear intent
```

### Issue 3: Tests Pass Locally, Fail in CI

**Symptom:** Local green, CI red

**Solution:**

1. Run in headed mode to verify visually
2. Add retries in CI config (not locally):

```typescript
export default defineConfig({
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
});
```

3. Use traces and screenshots for debugging:

```typescript
use: {
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
}
```

### Issue 4: Flaky Tests (Intermittent Failures)

**Symptom:** Same test sometimes passes, sometimes fails

**Solution:**

1. Use `waitForLoadState()` instead of hard waits
2. Wait for specific elements before assertions:

```typescript
// ❌ Flaky: No wait before assertion
await page.click('button');
await expect(page.getByText('Updated')).toBeVisible();

// ✅ Robust: Wait for element
await page.click('button');
await page.waitForLoadState('networkidle');
await expect(page.getByText('Updated')).toBeVisible();
```

3. Use explicit waits for async operations:

```typescript
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForResponse(response =>
  response.url().includes('/api/') && response.status() === 200
);
```

### Issue 5: Authentication Issues

**Symptom:** Can't access protected routes

**Solution:**

Use auth fixture to perform login once:

```typescript
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login once
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Reuse same page for all tests
    await use(page);
  },
});
```

---

## Integration with Angular CLI MCP

Use Angular CLI MCP tools alongside Playwright:

### Discover project structure:

```bash
# Via mcp_angular-cli_list_projects
→ Identify project name and root
→ Note workspace path for other MCP commands
```

### Get best practices before writing tests:

```bash
# Via mcp_angular-cli_get_best_practices
→ Ensure tests align with current Angular standards
→ Verify OnPush and signal patterns in tested components
```

### Search for testing patterns:

```bash
# Via mcp_angular-cli_search_documentation
→ Find TestBed patterns
→ Look up component testing with signals
→ Reference fixture and page object examples
```

---

## Verification Checklist

- [ ] Playwright installed: `npm list @playwright/test`
- [ ] Browsers installed: `npx playwright install` completed
- [ ] `playwright.config.ts` exists at project root
- [ ] `e2e/` directory created with test files
- [ ] `*.spec.ts` tests created with fixtures and page objects
- [ ] `npm run e2e` runs without errors
- [ ] `npm run e2e:ui` opens interactive test runner
- [ ] HTML report generated: `npx playwright show-report`
- [ ] CI/CD workflow configured (GitHub Actions or GitLab CI)
- [ ] Tests pass locally and in CI

---

## References

- [Playwright Official Docs](https://playwright.dev)
- [Playwright Component Testing](https://playwright.dev/docs/test-components)
- [Playwright Fixtures](https://playwright.dev/docs/test-fixtures)
- [Playwright Assertions](https://playwright.dev/docs/test-assertions)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Accessibility with Playwright](https://www.w3.org/WAI/test-evaluate/ct/)

---

## Example Project Structure

```
demo-project/
├── src/
│   ├── app/
│   │   ├── customers/
│   │   │   └── customers.component.ts
│   │   └── app.component.ts
│   ├── main.ts
│   └── index.html
├── e2e/
│   ├── fixtures/
│   │   ├── api.fixture.ts
│   │   └── auth.fixture.ts
│   ├── pages/
│   │   ├── customers.page.ts
│   │   └── login.page.ts
│   ├── customers.spec.ts
│   ├── customers.interaction.ts
│   └── login.spec.ts
├── angular.json
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Quick Start Summary

1. **Install:** `npm install --save-dev @playwright/test && npx playwright install`
2. **Configure:** Create `playwright.config.ts` with `testDir: './e2e'`
3. **Create Fixture:** Write `e2e/example.fixture.ts` with Page Object class
4. **Write Tests:** Create `e2e/example.spec.ts` using fixture
5. **Run Tests:** `npm run e2e` (dev server auto-starts if `webServer` configured)
6. **View Report:** `npx playwright show-report`

For detailed examples, see the `vitetest-testing` demo at `demos/08-testing/vitetest-testing/`.
