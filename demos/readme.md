# Angular Advanced Agentic Software Engineering

This workshop is for experienced Angular developers who want to master modern Angular development and learn to work with AI agents as a natural part of their daily workflow. Over twelve modules you will build real Angular v22 applications using standalone components, signal-based state, signal queries, and inject-based dependency injection throughout. Every concept is introduced through working demos that you can run, extend, and experiment with.

You start by setting up Claude Code and GitHub Copilot as your development partners, learning to write harness files, skills, subagents, and hooks that shape how these agents assist you across every module that follows. The same module introduces WebMCP, the in-app counterpart of the MCP server, so the app you build is itself reachable by an agent. The tools and habits you establish here stay with you for the rest of the course, so agentic development is not a standalone topic but a way of working you bring to every subsequent module.

With your tooling in place, you move into Angular's reactive core. Signals are the primary state primitive in modern Angular, and you cover the complete API including `signal()`, `computed()`, `effect()`, `linkedSignal()`, and `model()`, together with `httpResource()`, resource `chain()`, streaming resources, and `debounced()` for declarative data loading. The component module then builds on that foundation with signal queries, modern control flow, content projection, directive composition, programmatic components, `@angular/aria`, and `@defer`.

Signal Forms introduce a schema-driven approach to form construction where field state is exposed as signals that wire directly into your templates, including `validateHttp`, `FormValueControl`, JSON-driven dynamic forms, and date validators. You then step into reactive programming with RxJS, covering flattening and combining strategies, error handling, custom operators, and the interop patterns that connect observables and signals in both directions.

Application-level state comes next with NgRx SignalStore. You build stores using `withState()`, `withComputed()`, `withMethods()`, and `withEntities()`, compose them with `withFeature` and `withProps`, extend resources, and use the events plugin. Advanced routing follows, covering functional guards, HTTP interceptors, signal-based resolvers, route inputs, `provideAppInitializer` with `injectAsync`, `animate.enter`/`animate.leave`, and view transitions.

The last modules focus on production quality. Testing with Vitest covers signal input tests, service tests, SignalStore tests, Material harnesses, zoneless async testing, and Playwright, built around a demo where the agent writes the spec and a mutation round proves it. Performance and compliance covers Lighthouse, Rolldown bundle optimization, `@defer` triggers, virtual scrolling, image optimization, WCAG 2.2 AA with `@angular/aria`, and a CI gate that fails the pull request. Hybrid rendering closes the Angular material with server routes, `AngularNodeAppEngine`, incremental hydration, and the transfer cache. The course ends with Angular Elements and an agentic DevOps track that deploys and verifies a real site.

By the end of the workshop you will have a thorough understanding of how modern Angular applications are structured and a set of agentic workflows that make you faster at building and maintaining them. The combination of deep Angular knowledge and effective AI collaboration is what this course is designed to give you.

## Duration

12 Modules

## Audience

- Experienced Angular developers adopting modern Angular v22 patterns
- Teams migrating from legacy patterns to signals, Signal Forms, and NgRx SignalStore
- Developers seeking structured coverage of advanced routing, testing, performance, compliance, and SSR

## Prerequisites

- Solid experience with Angular (components, services, routing, forms)
- Familiarity with TypeScript and RxJS basics

## Modules

### [Module 01: Agentic Angular Software Engineering](./01-agentic-dev/)

- The Angular CLI MCP Server and its Tools
- Harness Files: CLAUDE.md, AGENTS.md, copilot-instructions.md
- Angular Agent Skills and Custom Subagents
- Hooks and Gates
- WebMCP as the App-Side Counterpart

### [Module 02: Mastering Signals](./02-signals/)

- Signals Fundamentals: signal(), computed(), effect()
- Signal Patterns: inputs, model(), linkedSignal, equality
- Async Signals: httpResource(), resource chain(), debounced()
- @Service and injectAsync
- Signals Tooling: DevTools signal graph, WebMCP over a signal

### [Module 03: Component Composition and Signal Queries](./03-components/)

- Modern Template Syntax and Control Flow
- Signal Queries: viewChild, viewChildren, contentChild, contentChildren
- Content Projection, Directive Composition, Programmatic Components
- Data Loading with resource() and @defer
- Accessible Composition with @angular/aria, WebMCP in Components
- Component Antipatterns and Agent-Driven Refactoring

### [Module 04: Signal Forms](./04-signal-forms/)

- Signal Form Basics: form(), fields, submission options
- Validation: validators, validateHttp, validateAsync, validateStandardSchema
- Error Handling with isSignalErrorState
- Advanced: arrays, nested objects, conditional fields, dynamic JSON forms
- Signal Forms and Agents: WebMCP form tools, AI-written form tests

### [Module 05: RxJS Where It Still Matters](./05-reactive/)

- Subscribe vs Stream vs Signal
- Flattening and Combining Strategies
- Error Handling and Custom Operators
- Signal Interop in Both Directions, rxResource, debounce three ways
- Agent-Assisted RxJS to Signals Migration

### [Module 06: State Management with NgRx SignalStore](./06-ngrx-signals/)

- SignalStore Fundamentals: withState(), withComputed(), withMethods()
- Entity Management with withEntities()
- Store Composition: signalMethod, withFeature, withProps
- Resource Extensions and Linked State
- The Events Plugin, Deep Signals, WebMCP over the Store

### [Module 07: Advanced Routing and App Initialization](./07-routing-app-init/)

- provideAppInitializer with injectAsync, @Service
- Functional Guards, HTTP Interceptors, Error Handling
- Signal-Based Resolvers and Route Inputs
- animate.enter / animate.leave and View Transitions
- Route-Driven SignalStore, WebMCP Navigation Tools

### [Module 08: Advanced Testing with Vitest and Playwright](./08-testing/)

- Vitest Fundamentals: pipes, directives, services, components
- Signal Inputs, Signal Forms, and SignalStore Testing
- Zoneless Async: whenStable, TestBed.tick, getLastFixture
- Material Harnesses and Browser Mode
- End-to-End with Playwright, including WebMCP
- AI Writes the Test: agent, checklist, mutation round

### [Module 09: Performance and Compliance](./09-performance-compliance/)

- Core Web Vitals Measurement with Lighthouse
- Bundle Optimization with Rolldown and Budgets
- @defer by Trigger, Zoneless, DevTools Profiling
- Virtual Scrolling and Image Optimization
- WCAG 2.2 AA with @angular/aria and axe
- Compliance Gates that Fail the Pull Request

### [Module 10: Hybrid Rendering: SSR, Prerendering and Incremental Hydration](./10-ssr/)

- Server Routes with RenderMode and getPrerenderParams
- Express 5 with AngularNodeAppEngine
- Incremental Hydration and Hydrate Triggers
- Transfer Cache with httpResource
- CSR vs SSR Delta, Karma to Vitest Migration

### [Module 11: Angular Elements](./11-elements/)

- Exposing a Standalone Component as a Custom Element
- Element-Specific Bootstrap and Configuration
- Dual Build: Application Mode and Element Mode
- Signals, input(), output() Inside a Custom Element

### [Module 12: Agentic Angular DevOps](./12-agentic-devops/)

- The Deployment Agent: Allowlists, Manifest and the Deploy-then-Prove Contract
- Bootstrapping and Hardening an Ubuntu Box over SSH
- Angular Multi-Stage Image behind a Caddy Edge with TLS
- DNS before the First ACME Attempt
- Core Web Vitals and SEO Fix-Verify Loop on Every Deploy
