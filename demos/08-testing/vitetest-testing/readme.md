# Vitest Testing Module - Angular 21+ Demo Catalog

| #   | Route                     | Title                      | Teaches                                                                                                                                                                              | Topic               |
| --- | ------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| 1   | `testing-intro`           | Hello World Test           | Write your first Vitest unit test. Understand describe/it blocks, assertions with expect, and beforeEach setup. Test a plain TypeScript class without Angular.                       | Introduction        |
| 2   | `pipe`                    | Test Pipe                  | Unit test Angular pipes in isolation by instantiating the pipe class directly and asserting transform output.                                                                        | Pipes & Directives  |
| 3   | `directive`               | Test Directive             | Test attribute directives by creating a host component in TestBed and asserting DOM changes caused by the directive.                                                                 | Pipes & Directives  |
| 4   | `http-tests`              | Service HTTP Test          | Test CustomersService CRUD operations using HttpTestingController. Flush mock responses and verify request URLs, methods, and body payloads for GET, POST, PUT and DELETE.           | Services            |
| 5   | `http-tests-signal`       | httpResource Test          | Test a component that uses Angular's httpResource() for reactive data fetching. Use HttpTestingController to flush responses and assert loading state and rendered output.           | Services            |
| 6   | `spy`                     | Comp Spy Customers         | Test CustomersComponent by providing a mock customersStore signal object. Use vi.fn() spies to assert that store methods are called correctly when component methods fire.           | Component Testing   |
| 7   | `component-write`         | Comp DOM Test              | Test CustomersTableComponent DOM output using setInput() for signal inputs. Query mat-row and mat-cell elements to verify rendered customer data and progress bar visibility.        | Component Testing   |
| 8   | `component-events`        | Comp Interaction Customers | Test CustomersComponent interactions end-to-end. Emit events from child presenter and assert that the container calls the correct store methods.                                     | Component Testing   |
| 9   | `component-test`          | CRUD Customers             | Test SimpleCustomersComponent which uses Angular's resource() API for data loading. Spy on CustomersService to control HTTP responses and verify add/delete interactions.            | Component Testing   |
| 10  | `component-input-signals` | Input Signals & Outputs    | Test CustomerEditComponent using fixture.componentRef.setInput() to set required signal inputs. Verify that save and cancel outputs emit the correct values.                         | Component Testing   |
| 11  | `material`                | Material Harness           | Test CustomersTableComponent using Angular Material test harnesses (MatTableHarness, MatButtonHarness). Interact with Material elements without coupling to DOM internals.           | Component Testing   |
| 12  | `async`                   | Comp Async Customers       | Test asynchronous loading in CustomersComponent using fakeAsync/tick. Verify that progress bar appears while loading and rows render after data arrives.                             | Async Testing       |
| 13  | `integration-tests`       | Container / Presenter      | Integration-test CustomersComponent (container) with real CustomersTableComponent and CustomerEditComponent (presenters). Verify signal data flow and output wiring across the tree. | Integration Testing |
| 14  | `mock-signals-store`      | Mock Signal Store          | Mock the markdownEditorStore in component tests by providing a fake store object with signal properties. Assert component behaviour based on controlled signal values.               | NgRx Testing        |
| 15  | `test-signals-store`      | Test Signal Store          | Test the markdownEditorStore directly by dispatching events via the Dispatcher. Verify state transitions for fetch, save, delete, and loadContent event flows.                       | NgRx Testing        |
| 16  | `simple-service`          | Simple Service             | Test a service class without DI by instantiating it directly. Verify add, delete and clear methods and state mutations in isolation.                                                 | Introduction        |
| 17  | `component-class`         | Class-Only Test            | Test component signal state by instantiating the class directly without TestBed. Fast and simple for pure logic tests that do not need the DOM.                                      | Component Testing   |
| 18  | `material-async`          | Material Async             | Combine Material test harnesses with async/await to interact with Material components that have asynchronous rendering.                                                              | Async Testing       |
| 19  | `playwright`              | Playwright E2E             | Write end-to-end tests with Playwright using the Page Object Model and fixtures. Reset API state between tests for full isolation.                                                   | E2E Testing         |

## Playwright Tests

End-to-end tests for the Customers feature live in [`e2e/`](e2e/).

| File                       | Purpose                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `customers.fixture.ts`     | `CustomersPage` POM + `test` fixture that resets json-server data before each test |
| `customers.spec.ts`        | 12 fixture-based tests covering table load, edit, delete, and add                  |
| `customers.interaction.ts` | Sequential interaction script mirroring manual browser exploration                 |

### Setup (first time)

```bash
npm install -D @playwright/test
npx playwright install chromium
```

### Running

Requires `ng serve` and `json-server` running in separate terminals.

```bash
# Run all e2e tests (headless)
npx playwright test

# Run with browser visible
npx playwright test --headed

# Interactive UI mode (recommended for debugging)
npx playwright test --ui

# Run a single file
npx playwright test e2e/customers.spec.ts
```
