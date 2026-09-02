# Angular Advanced Agentic Software Engineering

This workshop is for experienced Angular developers who want to master modern Angular development and learn to work with AI agents as a natural part of their daily workflow. Over twelve modules you will build real Angular v22 applications using standalone components, signal-based state, signal queries, and inject-based dependency injection throughout. Every concept is introduced through working demos that you can run, extend, and experiment with.

You start by setting up Claude Code and GitHub Copilot as your development partners, learning to write harness files, skills, subagents, and hooks that shape how these agents assist you across every module that follows. The tools and habits you establish here stay with you for the rest of the course, so agentic development is not a standalone topic but a way of working you bring to every subsequent module.

With your tooling in place, you move into Angular's reactive core. Signals are the primary state primitive in modern Angular, and you cover the complete API including `signal()`, `computed()`, `effect()`, `linkedSignal()`, and `model()`, together with `httpResource()`, resource `chain()`, streaming resources, and `debounced()` for declarative data loading. The component module then builds on that foundation with signal queries, modern control flow, content projection, directive composition, programmatic components, `@angular/aria`, and `@defer`.

Signal Forms introduce a schema-driven approach to form construction where field state is exposed as signals that wire directly into your templates, including `validateHttp`, `FormValueControl`, JSON-driven dynamic forms, and date validators. You then step into reactive programming with RxJS, covering flattening and combining strategies, error handling, custom operators, and the interop patterns that connect observables and signals in both directions.

Application-level state comes next with NgRx SignalStore. You build stores using `withState()`, `withComputed()`, `withMethods()`, and `withEntities()`, compose them with `withFeature` and `withProps`, extend resources, and use the events plugin. Advanced routing follows, covering functional guards, HTTP interceptors, signal-based resolvers, route inputs, `provideAppInitializer` with `injectAsync`, `animate.enter`/`animate.leave`, and view transitions.

The last modules focus on production quality. Testing with Vitest covers signal input tests, service tests, SignalStore tests, zoneless async testing, and Playwright, built around a demo where the agent writes the spec and a mutation round proves it. WebMCP then turns the application itself into something an agent can drive: seven demos expose a plain page, a signal, a component, a signal form, a SignalStore and the router as agent tools, and a suite that calls those tools the way an agent would. Optimization and compliance covers Lighthouse, Rolldown bundle optimization, `@defer` triggers, virtual scrolling, image optimization, WCAG 2.2 AA with `@angular/aria`, and a gate on the pull request. Hybrid rendering closes the Angular topics with server routes, `AngularNodeAppEngine`, incremental hydration, and the transfer cache. The course ends with an agentic DevOps track that deploys and verifies a real site.

By the end of the workshop you will have a thorough understanding of how modern Angular applications are structured and a set of agentic workflows that make you faster at building and maintaining them. The combination of deep Angular knowledge and effective AI collaboration is what this course is designed to give you.

## Duration

5 Days, 12 Modules

## Audience

- Experienced Angular developers adopting modern Angular v22 patterns
- Teams migrating from legacy patterns to signals, Signal Forms, and NgRx SignalStore
- Developers seeking structured coverage of advanced routing, testing, performance, compliance, and SSR

## Prerequisites

- Solid experience with Angular (components, services, routing, forms)
- Familiarity with TypeScript and RxJS basics

## Modules

### [Module 01: Agentic Angular Software Engineering](./01-agentic-dev/)

- The Angular CLI MCP Server
- Harness Files: CLAUDE.md, AGENTS.md, copilot-instructions.md
- Angular Agent Skills
- The Angular Expert Subagent
- Hooks and Quality Gates

### [Module 02: Mastering Signals](./02-signals/)

- Signals Fundamentals: signal(), computed(), effect()
- Signal Patterns: inputs, model(), linkedSignal, equality
- Async Signals: httpResource(), resource chain(), debounced()
- @Service and injectAsync
- Signals Tooling: the DevTools signal graph

### [Module 03: Component Composition and Signal Queries](./03-components/)

- Modern Template Syntax and Control Flow
- Signal Queries: viewChild, viewChildren, contentChild, contentChildren
- Content Projection, Directive Composition, Programmatic Components
- Data Loading with resource() and @defer
- Accessible Composition with @angular/aria
- Component Antipatterns and Agent-Driven Refactoring

### [Module 04: Signal Forms](./04-signal-forms/)

- Signal Form Basics: form(), fields, submission
- Validation: validators, validateHttp, validateAsync, validateStandardSchema
- Error Handling with isSignalErrorState
- Advanced: arrays, nested objects, dynamic forms
- Signal Forms and Agents: AI-written tests

### [Module 05: RxJS Where It Still Matters](./05-reactive/)

- Subscribe vs Stream vs Signal
- Flattening and Combining Strategies
- Error Handling and Custom Operators
- Signal Interop Both Ways, rxResource, debounce
- Agent-Assisted RxJS to Signals Migration

### [Module 06: State Management with NgRx SignalStore](./06-ngrx-signals/)

- SignalStore Fundamentals: withState(), withComputed(), withMethods()
- Entity Management with withEntities()
- Store Composition: signalMethod, withFeature, withProps
- Resource Extensions and Linked State
- The Events Plugin and Deep Signals

### [Module 07: Advanced Routing and App Initialization](./07-routing-app-init/)

- provideAppInitializer with injectAsync, @Service
- Functional Guards, HTTP Interceptors, Error Handling
- Signal-Based Resolvers and Route Inputs
- animate.enter / animate.leave and View Transitions
- Route-Driven SignalStore

### [Module 08: Advanced Testing with Vitest and Playwright](./08-testing/)

- Karma to Vitest Migration
- Vitest Fundamentals: pipes, directives, services, components
- Signal Inputs, Forms and Store Testing
- Zoneless Async: whenStable, TestBed.tick, getLastFixture
- Playwright Fundamentals
- Agent-Written Specs, Proven by Mutation

### [Module 09: WebMCP - The Agentic Web](./09-webmcp/)

- A Counterpart Page for the Agent
- Signals as WebMCP Tools
- WebMCP in Components
- A Signal Form as an Agent Tool
- SignalStore Methods as Tools
- Navigation Tools for the Agent
- Testing WebMCP Tools End to End

### [Module 10: Optimization and Compliance](./10-optimize-compliance/)

- Core Web Vitals Measurement with Lighthouse
- Bundle Optimization with Rolldown and Budgets
- @defer by Trigger, Zoneless, DevTools Profiling
- Virtual Scrolling and Image Optimization
- WCAG 2.2 AA with @angular/aria
- Compliance Gates on the Pull Request

### [Module 11: Hybrid Rendering and Hydration](./11-ssr/)

- Server Routes with RenderMode and getPrerenderParams
- Express 5 with AngularNodeAppEngine
- Incremental Hydration and Hydrate Triggers
- Transfer Cache with httpResource
- CSR vs SSR Measured Delta

### [Module 12: Agentic Angular DevOps](./12-agentic-devops/)

- The Deployment Agent: Allowlists and Manifest
- Bootstrapping and Hardening an Ubuntu Box
- Multi-Stage Container serving with Caddy
- DNS before the First ACME Attempt
- Core Web Vitals and SEO Loop
