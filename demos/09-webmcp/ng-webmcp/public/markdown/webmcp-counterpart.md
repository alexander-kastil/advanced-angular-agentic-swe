# WebMCP Counterpart

MCP runs in both directions. The Angular CLI MCP server lets an agent drive the workspace. WebMCP
lets the running application expose its own tools to a browser agent.

## The API in Angular 22

Verified against the installed `@angular/core` 22.1.4:

| Symbol | Package | Purpose |
| --- | --- | --- |
| `declareExperimentalWebMcpTool(tool, injector?)` | `@angular/core` | Registers one tool from an injection context and unregisters it when that context is destroyed. Returns a `Promise<void>`. |
| `provideExperimentalWebMcpTools(tools)` | `@angular/core` | `EnvironmentProviders` for a list of tools, tied to the injector lifecycle. |
| `provideExperimentalWebMcpForms()` | `@angular/forms/signals` | Exposes Signal Forms to the agent. Note the package: it is **not** in `@angular/core`. |

Supporting types, all exported from `@angular/core`: `WebMcpToolDescriptor`, `WebMcpToolExecute` and
`WebMcpClient`.

## A tool

```ts
declareExperimentalWebMcpTool({
  name: 'add_backlog_item',
  description: 'Adds an item to the backlog shown on this page.',
  inputSchema: {
    type: 'object',
    properties: { title: { type: 'string', description: 'The backlog item to add.' } },
    required: ['title']
  },
  execute: ({ title }, client) => {
    if (client.signal.aborted) return 'Aborted by the agent.';
    return this.addItem(title, 'agent');
  }
});
```

`execute` receives the arguments typed from `inputSchema` plus a `WebMcpClient` whose `signal` is an
`AbortSignal`. Honour it and clean up when the agent cancels. The return value is serialized back to
the agent and is typically a plain string.

Declare the schema with `as const` if you keep it in a variable. The generic is
`<const InputSchema extends JsonSchemaForInference>`, so a widened `type: string` will not satisfy it
and argument inference in `execute` collapses.

## The description and schema are the API

An agent picks a tool by reading its `name`, `description` and `inputSchema` from a `tools/list`
response and nothing else. There is no documentation page it can consult. Vague wording here is a
broken API, in exactly the way an unnamed parameter would be.

## Component scope versus application scope

`declareExperimentalWebMcpTool` ties the tool to the current injection context, so a tool declared in
a component constructor disappears with the component. That is usually what you want: a tool that
edits the page the user is on should not be callable from another route. Use the provider form for
tools that should live as long as the app or a lazy route:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalWebMcpTools([addBacklogItemTool, listBacklogItemsTool]),
    provideExperimentalWebMcpForms()
  ]
};
```

## Graceful when unsupported

Registration reads `document.modelContext`, falls back to `navigator.modelContext`, and returns early
unless that object has a `registerTool` function. In a browser with no agent surface the call is a
no-op and the promise still resolves, so write the tool once and let the capability decide. This demo
page reports which of the two it got.

## Experimental

The API is marked `@experimental` in 22.1.4 and can change. Do not add a polyfill package to get it:
use the in-framework symbols and let unsupported browsers no-op.
