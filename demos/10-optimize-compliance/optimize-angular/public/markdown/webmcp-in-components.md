# WebMCP Tools Scoped to a Component

Angular 22 ships an experimental WebMCP surface in `@angular/core`. It lets a page expose tools to a
browser agent the same way an MCP server exposes tools to a model.

Two entry points, both experimental:

| API                              | Scope                                                           |
| -------------------------------- | ---------------------------------------------------------------- |
| `provideExperimentalWebMcpTools` | application or route level, via `EnvironmentProviders`            |
| `declareExperimentalWebMcpTool`  | any injection context, so a component, a directive or a service   |

This demo uses the second one, because the interesting property is scope: the tool is registered
from the component's injection context and unregistered when that context is destroyed. Navigate
away and the tools go with the component.

## Declaring a tool

```typescript
export class WebmcpInComponentsComponent {
  readonly tasks = signal<Task[]>([...]);

  constructor() {
    declareExperimentalWebMcpTool({
      name: 'add_task',
      description: 'Adds a task to this component task list.',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'The title of the task to add.' },
        },
        required: ['title'],
      },
      execute: ({ title }) => {
        this.addTask(title);
        return `Added "${title}"`;
      },
    });
  }
}
```

- `inputSchema` is a JSON Schema object. Angular infers the `execute` argument type from it, so
  `title` above is typed `string` without a cast.
- `execute` runs in the injection context of the component, so `inject()` works inside it.
- The second argument of `execute` is a client object carrying an `AbortSignal`, for tools that do
  real work.
- The return value is serialised back to the agent, usually as a string.

## The tool and the template share one source of truth

`execute` closes over the same signals the template renders. There is no parallel agent-only model
to keep in sync: an agent adding a task and a user clicking a button both go through
`this.tasks.update(...)`, and the UI updates from the signal either way. That is the entire point of
declaring tools inside the component instead of in a service the UI does not read.

## No agent, no error

`declareExperimentalWebMcpTool` looks for `document.modelContext` or `navigator.modelContext`. When
neither exists, it returns without registering anything, so the component behaves normally in a
plain browser. The demo detects the same thing and tells you which of the two cases you are in.

Do not add a polyfill package for this. The in-framework API is the supported surface, and the
browser side of WebMCP is still moving.

## Writing tools an agent can actually use

- Name tools like functions, `add_task`, not `AddTaskTool`.
- The description is the prompt. Say what it does and when to reach for it.
- Keep the input schema flat and give every property a `description`.
- Return something an agent can read back: a confirmation string, or JSON it can parse.
- Scope the tool to the state it can see. A tool that reaches across the whole application belongs
  in `provideExperimentalWebMcpTools`, not in a component.
