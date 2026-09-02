Angular 22 ships an experimental WebMCP surface in `@angular/core` and `@angular/forms/signals`. A page that opts in can hand a browser agent a *tool* instead of asking it to guess at the DOM.

Three symbols, all verified against the installed 22.1.4:

| Symbol | Package | Purpose |
|---|---|---|
| `provideExperimentalWebMcpForms()` | `@angular/forms/signals` | Turns on the registration of forms that declare `experimentalWebMcpTool` |
| `declareExperimentalWebMcpTool()` | `@angular/core` | Registers one hand-written tool, scoped to an injector |
| `provideExperimentalWebMcpTools()` | `@angular/core` | Registers a list of tools for an environment injector |

## Turning the form itself into a tool

Enable the provider once, on the route or in `app.config.ts`:

```typescript
{
  path: 'webmcp-form-tool',
  providers: [provideExperimentalWebMcpForms()],
  loadComponent: () => import('./samples/webmcp-form-tool/webmcp-form-tool.component')
    .then((m) => m.WebMcpFormToolComponent),
}
```

Then name the tool in the third argument of `form()`:

```typescript
bookingForm = form(
  this.model,
  (s) => {
    required(s.guest, { message: 'Guest name is required' });
    minLength(s.guest, 3, { message: 'At least 3 characters' });
    required(s.guestEmail, { message: 'Email is required' });
    email(s.guestEmail, { message: 'Not a valid email address' });
    min(s.nights, 1, { message: 'At least one night' });
  },
  {
    experimentalWebMcpTool: {
      name: 'fill-booking-form',
      description:
        'Fill the hotel booking form. Accepts guest, guestEmail and nights and reports back which fields are still invalid.',
    },
  },
);
```

Angular derives the tool's input schema from the model shape, so the agent gets `guest`, `guestEmail` and `nights` without a second description of the same data. The validators stay in charge: an agent-supplied value goes through exactly the rules a human's keystrokes go through.

## An explicit tool alongside the form

`declareExperimentalWebMcpTool` takes a normal JSON Schema and an `execute` callback that runs in the given injection context:

```typescript
declareExperimentalWebMcpTool(
  {
    name: 'read-booking-form',
    description: 'Read the current state of the booking form.',
    inputSchema: {
      type: 'object',
      properties: {
        includeErrors: { type: 'boolean', description: 'Include validation messages.' },
      },
    },
    execute: (args) => JSON.stringify({ value: this.model(), valid: this.bookingForm().valid() }),
  },
  this.injector,
);
```

The tool unregisters itself when that injector is destroyed, so a lazy route cleans up on navigation.

## What happens without an agent

`declareExperimentalWebMcpTool` reads `document.modelContext ?? navigator.modelContext` and returns immediately when neither exists. In an ordinary browser both tools are silent no-ops and the page behaves exactly as before, which is why the demo also offers a **Simulate Agent Call** button: it writes the same model an agent would write, so you can watch validation react.

Both APIs are marked `@experimental`. Do not add a polyfill package for them; the in-framework surface is the one that will keep working.
