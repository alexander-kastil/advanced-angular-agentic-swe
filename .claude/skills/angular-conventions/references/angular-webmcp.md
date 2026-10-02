# WebMCP: exposing a page as agent tools

An agent can call a page directly when the page declares tools. Angular wraps the browser API; the
estate ships the same mechanism by hand on the Hugo sites, and both register against the same
surface.

## The surface, and why it is usually absent

```ts
// @angular/core, declareExperimentalWebMcpTool
const modelContext = globalThis.document.modelContext ?? globalThis.navigator.modelContext;
if (!modelContext || typeof modelContext.registerTool !== 'function') return;
```

`document.modelContext` first, `navigator.modelContext` as the fallback. Both are behind an
**origin trial**, so on a page with no token neither exists, every registration is a silent no-op,
and nothing errors. Checking only `navigator` and concluding the API is gone is the usual mistake.

The token is a meta tag for the page's own origin:

```html
<meta http-equiv="origin-trial" content="<token>">
```

The Hugo sites inject it from a param with a four-line `origin-trial.js` reading
`document.currentScript.getAttribute('data-origin-trial')`. An Angular app can carry the tag in
`index.html` directly.

Ship an availability helper rather than testing the global at each call site:

```ts
export function modelContext(): ModelContextLike | null {
  const host = globalThis as { document?: {...}; navigator?: {...} };
  const context = host.document?.modelContext ?? host.navigator?.modelContext;
  return context && typeof context.registerTool === 'function' ? context : null;
}
```

## Angular

`provideExperimentalWebMcpTools([...])` in the app config for tools that live as long as the app;
`declareExperimentalWebMcpTool(tool, injector)` inside an injection context for one that should
exist only while a view does. Angular ties the registration to `DestroyRef` through an
`AbortController`, which is the same `{ signal }` the raw API takes, and it skips registration
entirely under `ngServerMode`.

A `ToolDescriptor` is `{ name, description, inputSchema, execute }`. The `inputSchema` is JSON
Schema; set `additionalProperties: false`. A heterogeneous array of descriptors collapses the
generic, so type the array as `WebMcpToolDescriptor<any>[]` and read arguments out of a
`Record<string, unknown>` rather than fighting the inference.

The `description` is the only thing the agent reads before choosing the tool. Write it for that
reader: what it returns, what it does not return, and what it will not do.

## What not to expose

Every tool is a capability handed to something that is not the user and cannot be watched. The
test is not whether the operation is read-only; it is whether the damage would be visible on
screen while it happened.

| Expose | Refuse | Propose only |
| --- | --- | --- |
| list, search, open by name, navigate | reveal a value, copy a value, export everything, delete | fill a form the user still has to save |

Export fails the test despite being read-only. A tool that navigates through the real router is
better than one that answers privately, because the screen and the conversation stay on the same
record.

## Two artifacts the page also needs

A **static manifest** at `/webmcp.json` naming the tools and, usefully, the capabilities
deliberately withheld. An agent reads the shape without calling anything and a crawler reads it
without running JavaScript.

A **spec that asserts absence**. Tools are an API, and the assertion that matters is not that a
call returned something but that the response does not contain the value:

```ts
expect(result).not.toContain('super-secret-value');
expect(names).not.toContain('reveal_secret');
```

Run each tool by finding it in the exported array and calling `execute` inside
`runInInjectionContext` with the `EnvironmentInjector`. A tool that navigates needs a real route
table in `provideRouter`, or it throws `NG04002`.
