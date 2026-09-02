- WebMCP lets a page publish **tools** that a browser-resident AI agent can call. Angular 22 ships
  the framework side of it in `@angular/core`, with no extra package:

| API | Where it lives | Use it for |
| --- | --- | --- |
| `declareExperimentalWebMcpTool(tool, injector?)` | `@angular/core` | a tool bound to a component's own state |
| `provideExperimentalWebMcpTools(tools)` | `@angular/core` | page- or route-level tools, registered with the injector |
| `provideExperimentalWebMcpForms()` | `@angular/forms/signals` | lets an agent fill Signal Forms |

- A signal is the natural backing store for a tool: the getter tool reads it, the setter tool writes
  it, and every template bound to that signal updates the moment the agent acts.

```typescript
import { declareExperimentalWebMcpTool, signal } from '@angular/core';

readonly counter = signal(0);

constructor() {
  declareExperimentalWebMcpTool({
    name: 'read_counter',
    description: 'Reads the current value of the counter signal on this page.',
    inputSchema: { type: 'object', properties: {} },
    execute: () => `${this.counter()}`,
  });

  declareExperimentalWebMcpTool({
    name: 'set_counter',
    description: 'Sets the counter signal on this page to a new value.',
    inputSchema: {
      type: 'object',
      properties: { value: { type: 'number', description: 'The new counter value.' } },
      required: ['value'],
    },
    execute: ({ value }) => {
      this.counter.set(value);
      return `counter is now ${value}`;
    },
  });
}
```

- `inputSchema` is a JSON Schema literal, and the argument type of `execute` is **inferred from it**.
  Add `value: { type: 'number' }` and `({ value })` is typed `number`; there is no cast and no
  separate interface to keep in sync.

- A `ToolDescriptor` is exactly four fields: `name`, `description`, `inputSchema`, `execute`.
  The description is what the agent reads to decide whether to call the tool, so write it for a
  reader who cannot see the page.

- Lifecycle is handled for you. `declareExperimentalWebMcpTool()` must run in an injection context;
  it registers the tool immediately and unregisters it when that injector is destroyed. Navigate
  away from this demo and the two tools disappear with the component.

- `execute` runs **inside the component's injection context**, so `inject()` works there, and it
  receives a `client` whose `signal` is an `AbortSignal` combining the agent's cancellation with the
  component's destruction. Long-running tools should honour it.

- For tools that outlive a single component, provide them on the route or the application:

```typescript
{
  path: 'webmcp-signal',
  component: WebmcpSignalComponent,
  providers: [
    provideExperimentalWebMcpTools([
      {
        name: 'describe_signals_demo',
        description: 'Describes what the signals demo page exposes to an agent.',
        inputSchema: { type: 'object', properties: {} },
        execute: () => 'This page exposes read_counter and set_counter.',
      },
    ]),
  ],
}
```

- Both APIs **no-op safely** when nothing is listening: they look for
  `document.modelContext ?? navigator.modelContext`, and return immediately if there is no host or
  during server-side rendering. That is why the demo still works in a plain browser and prints
  `WebMCP host detected: no`. Nothing breaks; the tools simply are not registered.

- These names carry `Experimental` for a reason: the shape can change in a minor release. Keep tool
  declarations thin and put the real work in a service the tool calls.
