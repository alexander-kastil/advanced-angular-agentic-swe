## Overview

Angular 22 ships an experimental WebMCP surface in `@angular/core`: `declareExperimentalWebMcpTool()` and `provideExperimentalWebMcpTools()`. A tool is a named, described, schema-typed function that a browser agent can call while the user is on the page.

A SignalStore is the natural thing to expose. Its methods are already the application's write API, so a tool is a two-line wrapper rather than a parallel implementation.

Examine `support-queue.store.ts` and `webmcp-store.component.ts`.

## Declaring a Tool

```typescript
declareExperimentalWebMcpTool({
  name: 'add_ticket',
  description: 'Adds a support ticket to the queue and returns the created ticket.',
  inputSchema: {
    type: 'object',
    properties: {
      subject: { type: 'string', description: 'Short description of the problem.' },
      priority: { type: 'string', enum: ['low', 'normal', 'high'], description: 'Ticket priority.' },
    },
    required: ['subject'],
  },
  execute: ({ subject, priority }) => {
    const ticket = this.store.addTicket(subject, (priority ?? 'normal') as Priority);
    this.store.logAgentCall(`add_ticket ${subject}`);
    return JSON.stringify(ticket);
  },
});
```

The `inputSchema` is a JSON Schema subset, and the type of `args` in `execute` is inferred from it: `subject` is `string` because it is required, `priority` is optional, and its `enum` narrows it to the three literals. Change the schema and `execute` stops compiling.

The call must happen in an injection context (a constructor or a field initializer). The tool is unregistered automatically when that injector is destroyed, so navigating away from this demo removes the three tools.

## Two Ways In

`declareExperimentalWebMcpTool()` registers per component or per service, which is what you want for tools that only make sense on one screen.

`provideExperimentalWebMcpTools([...])` returns `EnvironmentProviders` and belongs in `bootstrapApplication` or a route's `providers` for tools that should exist for the whole app or the whole feature.

## When There Is No Agent

The implementation reads `document.modelContext ?? navigator.modelContext` and returns immediately when it is missing. No error, no warning, nothing registered. The demo checks the same thing itself so the page can say which mode it is in:

```typescript
const modelContext = (document as any).modelContext ?? (navigator as any).modelContext;
this.agentSurface.set(typeof modelContext?.registerTool === 'function');
```

Everything the tools do is also reachable through the UI, which is the rule worth keeping: a tool wraps a store method, it never becomes the only path to one.

## Designing the Tool Set

- One tool per intent, named as a verb the agent would use: `list_open_tickets`, `add_ticket`, `close_ticket`.
- Return a string. The agent gets whatever you return, serialized, so `JSON.stringify` of a small object beats a formatted sentence.
- Return the failure as data, not as a thrown error: `close_ticket` answers "No ticket with id 9" rather than rejecting.
- Do not expose a tool that can do something the user cannot undo on the page.
