# WebMCP E2E

Angular 22 ships an experimental WebMCP surface in `@angular/core`: a page can publish tools that a browser agent invokes directly, instead of the agent guessing at buttons. Those tools are a public API of the page, so they need tests like any other API, and they make a very good E2E entry point.

## What actually exists in 22.1.4

Three symbols, verified against the installed `@angular/core`:

| Symbol | Package | Purpose |
| --- | --- | --- |
| `declareExperimentalWebMcpTool` | `@angular/core` | registers one tool, tied to the current injection context |
| `provideExperimentalWebMcpTools` | `@angular/core` | registers a list of tools for an injector |
| `provideExperimentalWebMcpForms` | `@angular/forms/signals` | exposes Signal Forms to an agent |

No polyfill package is involved. `declareExperimentalWebMcpTool` looks for `document.modelContext ?? navigator.modelContext` and **returns silently when neither exists**, so a page that declares tools still runs normally in a browser with no agent bridge.

## Declaring a tool

```typescript
void declareExperimentalWebMcpTool({
  name: 'add_book',
  description: 'Adds a book to the reading list.',
  inputSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'The book title' },
      author: { type: 'string', description: 'The author of the book' },
    },
    required: ['title', 'author'],
  },
  execute: ({ title, author }) => {
    if (this.books().some((b) => b.title === title)) {
      return `${title} is already on the list.`;
    }
    this.books.update((all) => [...all, { title, author, read: false }]);
    return `Added ${title} by ${author}.`;
  },
});
```

`execute` receives arguments typed from `inputSchema` and runs in the declaring injection context, so `inject()` works inside it. It returns whatever the agent should read back, normally a string. Return a sentence for a failure rather than throwing: a thrown error tells the agent nothing it can act on.

## Unit testing the tools

The registration path is a plain function call against `navigator.modelContext`, so stub it and capture what the component registers.

```typescript
Object.defineProperty(navigator, 'modelContext', {
  value: { registerTool },
  configurable: true,
  writable: true,
});
```

`registerTool` is called synchronously while the component is constructed, so the tools are there right after `TestBed.createComponent`. Three things are worth asserting:

```typescript
it('registers all three tools with the browser bridge', () => {
  expect(tools.map((t) => t.name)).toEqual(['list_reading_list', 'add_book', 'mark_read']);
});

it('adds a book through the tool and renders it', () => {
  tool('add_book').execute({ title: 'Test Driven Development', author: 'Kent Beck' });
  TestBed.tick();

  expect(fixture.nativeElement.querySelectorAll('[data-testid="book-row"]').length).toBe(3);
});

it('aborts the registration signal when the component is destroyed', () => {
  fixture.destroy();
  expect(signals.every((s) => s.aborted)).toBe(true);
});
```

The middle one is the important shape: **invoke the tool, then assert the DOM**. A tool that changes state without the page reflecting it is exactly the bug this surface introduces. The last one guards the leak: Angular wraps every tool with an `AbortController` tied to the injector, and a tool that outlives its component is a tool the agent can still call against a destroyed page.

The spec also runs the component with no `modelContext` at all and asserts it still renders, because that is what every browser does today.

## Driving it end to end with Playwright

Real browsers do not implement `navigator.modelContext` yet. Install a capturing bridge with `addInitScript`, which runs before any application code on every page:

```typescript
const bridgeScript = () => {
  const registry: { name: string; execute: (args: unknown, client: unknown) => unknown }[] = [];

  (navigator as unknown as { modelContext: unknown }).modelContext = {
    registerTool(tool) {
      registry.push(tool);
      return Promise.resolve();
    },
  };

  window.__webmcp = {
    get tools() { return registry.map((t) => ({ ...t })); },
    async call(name, args) {
      const tool = registry.find((t) => t.name === name);
      if (!tool) throw new Error(`tool ${name} is not registered on this page`);
      return await tool.execute(args, { signal: new AbortController().signal });
    },
  };
};
```

The test then plays the agent: call a tool, assert the page.

```typescript
test('adding a book renders a new row', async ({ webmcp }) => {
  await expect(webmcp.rows()).toHaveCount(2);

  const result = await webmcp.callTool('add_book', {
    title: 'Test Driven Development',
    author: 'Kent Beck',
  });

  expect(result).toBe('Added Test Driven Development by Kent Beck.');
  await expect(webmcp.rows()).toHaveCount(3);
});
```

This is a genuine end-to-end test of the agent path: real bundle, real router, real change detection, and the only stub is the browser API that does not ship yet.

## Running it

`e2e/webmcp.spec.ts` runs with Playwright, not with `npm test`. Vitest only collects `src/**/*.spec.ts`, so the unit spec runs in CI on every commit and the Playwright pair runs against a served app:

```bash
npx playwright install chromium
npm run e2e:webmcp
```

`playwright.config.ts` starts the dev server itself, and this spec needs no json-server: the reading list is local component state. It passes against the real bundle:

```
Running 6 tests using 1 worker
  6 passed (2.7s)
```

## Design rules for testable tools

- **Name the tool after the user's intent**, not the handler (`mark_read`, not `updateBookState`).
- **Return a sentence**, including for failures. That return value is your assertion surface in both test layers.
- **Keep `execute` free of DOM work.** Update signals and let rendering follow, so the unit spec can assert state and the E2E spec can assert pixels.
- **Test the unregistered case.** Every browser today is that case.
