# Driving a Component Refactor with an Agent

The demo puts one component in two states side by side: as it was written for Angular 8, and as it
is written for Angular 22. The Angular 22 version is not a listing, it is the code rendering the
badges above it. The legacy version is shown as text on purpose, because the module is swept clean
of the APIs it uses.

## What changed

| Legacy                                     | Angular 22                                      | Driven by                                          |
| ------------------------------------------ | ----------------------------------------------- | -------------------------------------------------- |
| `@Input() name: string`                    | `name = input.required<string>()`               | `ng generate @angular/core:signal-input-migration`  |
| `@Output() selected = new EventEmitter()`  | `selected = output<string>()`                   | `ng generate @angular/core:output-migration`        |
| `constructor(private labels: Service)`     | `private readonly labels = inject(Service)`     | `ng generate @angular/core:inject-migration`        |
| `@HostBinding` / `@HostListener`           | `host: {}` in the component metadata            | agent edit                                          |
| `*ngIf` with an `else` template            | `@if` / `@else`                                 | `ng generate @angular/core:control-flow`            |
| `ngOnInit` assigning a derived field       | `computed()`                                    | agent edit                                          |
| hand-written `changeDetection: OnPush`     | deleted, it is the Angular 22 default           | agent edit                                          |

Four of the seven have an official schematic. Run those first, always, before an agent touches
anything: they are exact, they are reversible through git, and they leave the agent with a much
smaller and much more interesting problem.

## The part a schematic cannot do

The remaining three rows are judgement calls:

- `@HostBinding`/`@HostListener` become a `host` object, and the getter that backed the binding
  usually collapses into the expression itself. Mechanical, but it needs to read the class.
- `ngOnInit` assigning a field from another field is a `computed()`, unless the field is written
  elsewhere too, in which case it is a `linkedSignal()`. Only reading the whole class tells you
  which.
- Deleting `changeDetection: ChangeDetectionStrategy.OnPush` is only safe when it is the default,
  which it is in Angular 22, and the now-unused import has to go with it.

## Briefing the agent

Give the agent the version and the rule set before the file. The Angular MCP server exposes
`get_best_practices`, which returns the version-specific standards for the workspace:

```text
1. call get_best_practices for this workspace
2. read src/app/demos/samples/agentic-refactor/pet-badge/pet-badge.component.ts
3. rewrite it to Angular 22 against those practices
4. run the build
```

Without step 1 the agent writes whatever Angular it saw most of during training, which for
decorators and structural directives is Angular 8 to 15. The failure is quiet: the code compiles,
the tests pass, and the file is five years out of date.

Two more MCP tools are worth wiring into the same loop:

| Tool                          | Use                                                     |
| ----------------------------- | -------------------------------------------------------- |
| `search_documentation`        | settle an API question instead of guessing a symbol      |
| `onpush_zoneless_migration`   | the change detection half of the same modernisation      |

## Verifying, not trusting

A refactor report is a claim. The receipts for this one:

```bash
npm run build
grep -rn "@Input(\|@Output(\|@HostListener\|@HostBinding\|\*ngIf" src/app
```

An empty grep from the module root plus a green build is the evidence. "I converted the component"
is not.
