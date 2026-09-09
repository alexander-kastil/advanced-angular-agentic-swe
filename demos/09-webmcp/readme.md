# WebMCP: The Agentic Web

An agent that drives your application through the DOM clicks pixels and guesses at labels. WebMCP turns that around: the page declares its own tools, with names, descriptions and JSON schemas, and the agent calls them the way it calls any MCP server. Angular 22 ships the experimental client side of this as `declareExperimentalWebMcpTool()` and `provideExperimentalWebMcpTools()` in `@angular/core`, plus `provideExperimentalWebMcpForms()` and the `experimentalWebMcpTool` option on `form()` in `@angular/forms/signals`.

The tools are ordinary Angular code. A tool declared in a component closes over that component's signals, runs the same method the button runs, and unregisters when the component is destroyed, so there is no second code path to keep in sync with the UI. Where the browser exposes no model context, `declareExperimentalWebMcpTool()` returns early and registration is a no-op, so the same source runs unchanged in a browser without an agent.

This module works through the seven surfaces you would expose: a page, a signal, a component, a Signal Form, an NgRx SignalStore, the router, and the test suite that calls the tools the way an agent would.

## Demos

| # | Route | Title | Teaches |
|---|-------|-------|---------|
| 1 | `webmcp-counterpart` | WebMCP Counterpart | Expose the running app to a browser agent with `declareExperimentalWebMcpTool()` from `@angular/core`. Register two live tools, read the `tools/list` payload an agent would see, and watch registration no-op where no model context exists. |
| 2 | `webmcp-signal` | Signals as WebMCP Tools | Expose a signal value and its setter as tools, and register page-level tools through `provideExperimentalWebMcpTools()` in the route's providers. |
| 3 | `webmcp-in-components` | WebMCP in Components | Declare tools inside a component so each tool closes over the component's signals and unregisters with the component. |
| 4 | `webmcp-form-tool` | Form as an Agent Tool | Expose a Signal Form: `provideExperimentalWebMcpForms()` plus the `experimentalWebMcpTool` option on `form()` for filling it, and an explicit read tool that reports the per-field validation errors back. |
| 5 | `webmcp-store` | WebMCP Store Tools | Expose NgRx SignalStore methods as tools. Each tool declares a JSON schema and calls the same store method the UI calls. |
| 6 | `webmcp-navigation` | WebMCP Navigation Tools | Hand the router to the agent as tools scoped to the component that owns them, so it navigates by route rather than by clicking links. |
| 7 | `webmcp-e2e` | WebMCP E2E | Test the tools the way an agent calls them: a Vitest spec against a stubbed model context, and a Playwright run that invokes `list_reading_list`, `add_book` and `mark_read` and asserts the rendered page. |

## Run the app

```bash
cd ng-webmcp
npm install
npx json-server --watch db.json
npm start
```

The demo shell reads its catalog from `http://localhost:3000`, so start `json-server` against `db.json` before serving the app.

## Run the tests

```bash
npm test
npx playwright test
```

`npm test` runs the Vitest specs through the `@angular/build:unit-test` builder, including `webmcp-counterpart.component.spec.ts` and `webmcp-e2e.component.spec.ts`, which call the declared tools against a stubbed model context. The Playwright config in `playwright.config.ts` starts `ng serve` itself; `e2e/webmcp.fixture.ts` reaches the page's tools and `e2e/webmcp.spec.ts` drives the reading list through them.

## Links

- [Angular WebMCP](https://angular.dev/ai/webmcp)
- [WebMCP explainer (W3C community group)](https://github.com/webmachinelearning/webmcp)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [WebMcpClient API](https://angular.dev/api/core/WebMcpClient)
