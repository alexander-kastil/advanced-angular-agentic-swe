# Component Composition and Signal Queries

| # | Route | Title | Teaches | Topic |
| --- | --- | --- | --- | --- |
| 1 | control-flow | Control Flow & Template Syntax | Use the built-in control flow blocks @if, @for, @switch, @let and @defer, and write arrow functions and spread expressions directly in the template instead of wrapper methods. | Template Syntax |
| 2 | defer-idle-timeout | Defer Triggers & Timeouts | Drive @defer with on idle, on timer and on interaction triggers, and control what the user sees with the @placeholder, @loading and @error blocks and their after and minimum timings. | Template Syntax |
| 3 | content-projection | Content Projection | Design flexible components with ng-content slots. Pass template content to child components using named projections and default content. | Component Composition |
| 4 | directive-composition | Directive Composition | Combine multiple directives on a single element to compose behaviour, and attach directives to a component with hostDirectives. | Component Composition |
| 5 | signal-queries | Signal Queries | Query the view and the projected content with viewChild, viewChildren, contentChild and contentChildren as signals, without AfterViewInit or AfterContentInit hooks. | Component Composition |
| 6 | aria-composition | Accessible Composition | Compose accessible widgets from the headless @angular/aria directives: ngTabs with lazy tab content and a multi select ngListbox with roving tabindex and typeahead. | Component Composition |
| 7 | template-vs-container | Template vs Container | Understand the difference between ng-template and ng-container, and compare ng-content projection with ngTemplateOutlet rendering. | Component Advanced Patterns |
| 8 | host-binding-listener | Host Bindings & Listeners | Bind host properties, attributes and events through the host object in the component and directive metadata instead of the retired @HostBinding and @HostListener decorators. | Component Advanced Patterns |
| 9 | dynamic-components | Dynamic Components & Bindings | Create components at runtime with ViewContainerRef.createComponent() and the standalone createComponent(), and wire them with inputBinding, outputBinding and twoWayBinding instead of one-shot setInput() calls. | Component Advanced Patterns |
| 10 | resource-api | Resource API | Load HTTP data declaratively with httpResource(). The request tracks its signal dependencies and exposes value, status and error without a subscription. | Data Loading |
| 11 | resource-with-params | Resources with Parameters | Parameterise httpResource() from a component signal input and resource() from a params function, and use abortSignal and reload() to control the request lifecycle. | Data Loading |
| 12 | webmcp-in-components | WebMCP in Components | Register agent tools from inside a component with declareExperimentalWebMcpTool so the tool closes over the component signals and unregisters with the component. | Agentic Angular |
| 13 | agentic-refactor | Agentic Refactor | Turn an NgModule-era component into an Angular 22 one, and see which steps a schematic owns and which ones an agent has to make against the Angular MCP get_best_practices output. | Agentic Angular |
| 14 | antipatterns | Antipatterns | The Angular 22 anti-pattern table: what to stop writing and what replaces it, from decorator inputs and structural directives to withXhr, Karma and allowSignalWrites. | Component Antipatterns |

## Setup

```bash
npm install
json-server db.json
npm start
```

## Layout

- `db.json` at the app root is the demo catalog and the json-server database.
- `src/app/demos/demo.routes.ts` declares one route per `db.json` url.
- `src/app/demos/samples/<url>/` holds the component for that route.
- `public/markdown/<md>.md` is the guide rendered next to each demo (`markdownPath` in `src/environments`).
