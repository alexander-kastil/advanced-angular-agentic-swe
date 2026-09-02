# Vitest Testing - Angular 22 Demo Catalog

| #   | Route | Title | Teaches | Topic |
| --- | ----- | ----- | ------- | ----- |
| 1 | `testing-foundations` | Testing Foundations | Write your first Vitest tests with no TestBed at all: a plain class, two pipes, a service without dependencies, and a component tested through its class. describe/it/expect/beforeEach, value and error assertions. | Introduction |
| 2 | `directive` | Test Directive | Test an attribute directive by rendering it on a host component in TestBed and asserting the DOM change it causes. Uses the host object instead of @HostListener. | Pipes & Directives |
| 3 | `http-tests` | Service HTTP Test | Test CustomersService CRUD with HttpTestingController. Flush mock responses and verify request URL, method and body for GET, POST, PUT and DELETE. | Services |
| 4 | `http-tests-signal` | httpResource Test | Test a component that reads data with httpResource(). Flush the request through HttpTestingController and assert the loading state and the rendered rows. | Services |
| 5 | `http-error-tests` | HTTP Error Tests | Test the failure half of an HTTP call: flush 404, 409, 5xx and a transport error through HttpTestingController, and assert that a functional interceptor maps each status to a readable message and records it. | Services |
| 6 | `component-write` | Comp DOM Test | Read and write the DOM from a spec: type into an input and assert component state, then fire clicks with triggerEventHandler and with the native click API. | Component Testing |
| 7 | `component-input-signals` | Input Signals & Outputs | Set required signal inputs with fixture.componentRef.setInput() on CustomerEditComponent and assert that the save and cancel outputs emit the right values. | Component Testing |
| 8 | `component-test` | CRUD Customers | Test SimpleCustomersComponent, which loads through Angular's resource() API. Spy on CustomersService to control responses and verify the delete and reload path. | Component Testing |
| 9 | `material` | Material Harness | Drive Material components through test harnesses instead of DOM selectors: MatButtonHarness, MatInputHarness, MatSliderHarness, MatTableHarness, and harnesses over asynchronous tab rendering. | Component Testing |
| 10 | `browser-mode-harnesses` | Harnesses in Browser Mode | Drive slide toggle, checkbox, select and button through CDK component harnesses, including the select overlay through documentRootLoader, and run the same spec unchanged under jsdom or Vitest browser mode. | Component Testing |
| 11 | `spy` | Comp Spy & Async State | Replace the signal store with a vi.fn() spy object and steer its signals from the test. Assert store calls and the loading, loaded and selected states without fakeAsync. | Component Testing |
| 12 | `signal-forms-testing` | Test a Signal Form | Test a Signal Form without the DOM: write field values through field().value.set(), assert required, email, minLength and cross-field errors, then submit() and check touched state, the action result and a server error bound back onto a field. | Forms Testing |
| 13 | `zoneless-async` | Zoneless Async | Await asynchronous work in a zoneless app: PendingTasks plus fixture.whenStable(), TestBed.tick() to flush effects and rendering, Vitest fake timers for intervals, and TestBed.getLastFixture() when a helper created the fixture. | Async Testing |
| 14 | `integration-tests` | Container / Presenter | Integration-test the container with its real presenters. Verify signal inputs flowing down and outputs wiring back up across the whole tree. | Integration Testing |
| 15 | `test-signals-store` | Test Signal Store | Test an NgRx SignalStore built from events. Dispatch through the Dispatcher and assert the state transitions for fetch, save, delete and loadContent. | NgRx Testing |
| 16 | `playwright` | Playwright E2E | Write end-to-end tests with Playwright using the Page Object Model and fixtures. Reset API state between tests for full isolation. | E2E Testing |
| 17 | `webmcp-e2e` | WebMCP E2E | Declare page tools with declareExperimentalWebMcpTool and test them the way an agent would call them: a Vitest spec against a stubbed model context, and a Playwright run that invokes the tools and asserts the rendered page. | E2E Testing |
| 18 | `ai-generated-test` | AI Generated Spec | Prompt the agent to generate a Vitest spec for a branch-heavy class, then review it: mutate the code to prove the tests bite, check boundary values, and reject assertions that only re-state the implementation. | AI-Assisted Testing |
| 19 | `ai-writes-the-test` | AI Writes the Test | The full loop: state the behaviour, let the agent write the spec with get_best_practices and run_target, review it against a checklist, then run a mutation round that proves the suite goes red when the code breaks. | AI-Assisted Testing |

## Playwright Tests

End-to-end tests for the Customers feature live in [`e2e/`](e2e/).

| File | Purpose |
| ---- | ------- |
| `customers.fixture.ts` | `CustomersPage` POM and the `test` fixture that resets json-server data before each test |
| `customers.spec.ts` | Fixture-based tests covering table load, edit, delete and add |
| `customers.interaction.ts` | Sequential interaction script mirroring manual browser exploration |
| `webmcp.fixture.ts` | Installs a capturing `navigator.modelContext` bridge with `addInitScript` and exposes `window.__webmcp` to the test |
| `webmcp.spec.ts` | Drives the `webmcp-e2e` demo by invoking its WebMCP tools and asserting the rendered page |

`@playwright/test` is a devDependency of this app and `playwright.config.ts` points at `tsconfig.e2e.json`, so the `e2e/` files are type checked (`npx tsc -p tsconfig.e2e.json --noEmit`) and not just transpiled at run time.

### Setup (first time)

```bash
npx playwright install chromium
```

### Running

`playwright.config.ts` starts `ng serve` itself and reuses one that is already running. `customers.spec.ts` also needs the API, so start it first:

```bash
npm run api
npm run e2e
```

```bash
npm run e2e:webmcp                       # needs no API
npx playwright test --headed
npx playwright test --ui
npx playwright test e2e/customers.spec.ts
PW_PORT=4308 npm run e2e                 # serve on another port
```
