# Navigation as WebMCP Tools

## The in-framework API

Angular 22 exports three experimental WebMCP symbols. Two live in `@angular/core`:

```typescript
import { declareExperimentalWebMcpTool, provideExperimentalWebMcpTools } from '@angular/core';
```

The third is a Signal Forms concern and lives in `@angular/forms/signals`, not in core:

```typescript
import { provideExperimentalWebMcpForms } from '@angular/forms/signals';
```

No polyfill package is involved. The browser is expected to expose `document.modelContext` or `navigator.modelContext`; when neither exists, `declareExperimentalWebMcpTool` returns without registering anything and the page behaves normally. That is why this demo renders and works in a plain browser, and why the buttons call the same code the tool would.

## Declaring a tool

```typescript
declareExperimentalWebMcpTool({
  name: 'navigate_to_demo',
  description:
    'Navigate the application to one demo. Pass the route segment returned by list_demos.',
  inputSchema: {
    type: 'object',
    properties: {
      url: { type: 'string', description: 'Route segment of the demo, for example route-titles' },
    },
    required: ['url'],
  },
  execute: async ({ url }) => {
    const ok = await this.router.navigate(['/demos', url]);
    return ok ? `Navigated to /demos/${url}` : `Navigation to /demos/${url} was rejected`;
  },
});
```

`inputSchema` is JSON Schema, and Angular infers the argument type of `execute` from it. Declaring `url` as `type: 'string'` is what makes `({ url })` a `string` with no cast.

The signature is `declareExperimentalWebMcpTool(tool, injector?)`. Called with no injector it must run in an injection context, which is why the calls sit in the component constructor.

## Lifetime is the whole point

The tool is registered when the injection context is created and unregistered when it is destroyed. Declaring the tools in a component means an agent can drive navigation only while that component is on screen. Angular also builds an `AbortController` per tool: the abort signal fires on destroy, and it is merged with the client's own signal before `execute` runs, so a tool call that outlives the component is cancelled rather than left dangling.

`execute` runs inside the owning injection context, so `inject()` works in it.

For tools that should exist for the whole application, use the provider form in `app.config.ts` instead:

```typescript
provideExperimentalWebMcpTools([
  { name: 'current_route', description: '...', inputSchema: { type: 'object', properties: {} }, execute: () => inject(Router).url },
]),
```

It registers each tool through an environment initializer and ties them to that injector's lifetime.

## Designing navigation tools

Three tools cover navigation for an agent, and this demo declares exactly those:

| Tool | Why an agent needs it |
| --- | --- |
| `list_demos` | Discovery. An agent cannot guess route segments, so hand it the list with titles and topics. |
| `navigate_to_demo` | The action. It takes a segment from `list_demos`, so the vocabulary is closed. |
| `current_route` | Orientation. Lets the agent confirm the effect of its own call. |

Two rules worth keeping:

- Return the outcome, not `void`. `router.navigate` resolves to `false` when a guard blocks the move; saying so is more useful to an agent than silence.
- Never expose a tool that does something the current user is not allowed to do. A tool call is not an authorization boundary; the guards behind it are.

`execute` returns `unknown` and the host serializes it, so a string or JSON string is the practical choice.
