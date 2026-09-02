# Advanced Testing with Vitest and Playwright

Modern Angular testing on Angular 22 with Vitest through the `@angular/build:unit-test` builder. You will test components with signal inputs using `fixture.componentRef.setInput()`, services with `HttpTestingController` including the error paths and an interceptor, `httpResource()` reads, Signal Forms through their `FieldTree`, NgRx SignalStores driven by events, and Material components through CDK harnesses that run unchanged under jsdom or Vitest browser mode. The app is zoneless, so asynchronous specs use `PendingTasks`, `fixture.whenStable()`, `TestBed.tick()` and Vitest fake timers rather than `fakeAsync`. The module closes with Playwright end-to-end tests, a Playwright run that drives the app through its WebMCP tools, and two demos on letting an agent write your specs: one on prompting for a spec, one on the full loop from behaviour statement to mutation round.

## Demos

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

## Running the tests

```bash
cd vitetest-testing
npm install
npm test
```

Playwright end-to-end tests live in `vitetest-testing/e2e/`, are type checked through `tsconfig.e2e.json` and run through `npm run e2e`. The config starts `ng serve` itself; `customers.spec.ts` also needs `npm run api`.

The same specs run in a real Chromium through Vitest browser mode. Both dev dependencies are installed; only the browser binary is a one-time download:

```bash
npx playwright install chromium
npm run test:browser
```
