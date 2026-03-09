# Angular Advanced Agentic Software Engineering

This workshop is for experienced Angular developers who want to master modern Angular development and learn to work with AI agents as a natural part of their daily workflow. Over ten modules you will build real Angular v21 applications using standalone components, signal-based state, OnPush change detection, and inject-based dependency injection throughout. Every concept is introduced through working demos that you can run, extend, and experiment with.

You start by setting up GitHub Copilot and Claude Code as your development partners, learning to write custom instructions, reusable prompt files, and skills that shape how these agents assist you across every module that follows. The tools and habits you establish here stay with you for the rest of the course, so agentic development is not a standalone topic but a way of working you bring to every subsequent module.

With your tooling in place, you move into Angular's reactive core. Signals are the primary state primitive in modern Angular, and you cover the complete API including `signal()`, `computed()`, `effect()`, `linkedSignal()`, and `model()`, together with `httpResource()` for declarative data loading and `toSignal()` for connecting observables to the signal graph. The component module then builds on that foundation with standalone architecture, modern control flow syntax, content projection, directives composition, dynamic components, and the Resource API.

Signal-based forms introduce a schema-driven approach to form construction where field state is exposed as signals that wire directly into your templates. You then step into reactive programming with RxJS, covering the operator model, marble testing, custom operators, and the interop patterns that let you use observables and signals together, which also gives you the foundation patterns that NgRx effects rely on.

Application-level state comes next with NgRx SignalStore. You build stores using `withState()`, `withComputed()`, `withMethods()`, and `withEntities()`, write reusable custom store features, and see how SignalStore relates to classic NgRx for teams working in existing codebases. Advanced routing follows, covering functional guards, HTTP interceptors, signal-based resolvers and route parameter binding, preloading strategies, and the View Transitions API for polished navigation.

The last three modules focus on production quality. Testing with Vitest covers component signal input tests, service tests with `HttpTestingController`, NgRx SignalStore tests, Angular Material harnesses, and end-to-end tests with Playwright. Performance optimization walks through Lighthouse audits, bundle analysis with esbuild, zoneless change detection, CDK virtual scrolling, and image optimization. The course closes with server-side rendering using `@angular/ssr`, non-destructive hydration, `httpResource()` in an SSR context, and static pre-rendering for maximum initial load performance.

By the end of the workshop you will have a thorough understanding of how modern Angular applications are structured and a set of agentic workflows that make you faster at building and maintaining them. The combination of deep Angular knowledge and effective AI collaboration is what this course is designed to give you.

## Duration

10 Modules

## Audience

- Experienced Angular developers adopting modern Angular v21+ patterns
- Teams migrating from legacy patterns to signals, standalone components, and NgRx SignalStore
- Developers seeking structured coverage of advanced routing, testing, performance, and SSR

## Prerequisites

- Solid experience with Angular (components, services, routing, forms)
- Familiarity with TypeScript and RxJS basics

## Modules

### [Module 01: Agentic Angular Development](./01-agentic-dev/)

- Agentic Coding with GitHub Copilot and Claude Code
- Instructions and Reusable Prompt Files
- Skills and Plugins
- Designing and Using Custom Agents

### [Module 02: Mastering Signals](./02-signals/)

- Signals Fundamentals: signal(), computed(), effect()
- HTTP Resource API with httpResource()
- LinkedSignal and Model Two-Way Binding
- RxJS to Signals Interop with toSignal()
- Zoneless Change Detection

### [Module 03: Components and Composition](./03-components/)

- Standalone Components and Modern Bootstrap
- Control Flow Syntax (@if, @for, @switch)
- Content Projection and Directives Composition
- Dynamic Components and View Queries
- Resource API for Declarative Data Loading

### [Module 04: Signal Forms](./04-signal-forms/)

- Signal-Based Form Construction with form() and FormField
- Built-in and Custom Validators
- Async Validators and Cross-Field Rules
- Nested Forms, Form Arrays, and Conditional Fields
- CRUD Workflow with Signal Forms

### [Module 05: Mastering Reactive Programming with RxJS](./05-reactive/)

- Declarative Programming with Observables
- Core Operators: Map, Filter, Combine, Transform
- Error Handling and Marble Testing
- Observable to Signal Interop Patterns
- Foundation Patterns for NgRx Effects

### [Module 06: State Management with NgRx SignalStore](./06-ngrx-signals/)

- SignalStore with withState(), withComputed(), withMethods()
- Entity Management with withEntities()
- Custom Store Features
- Deep Signals for Complex State
- Integration with Classic NgRx

### [Module 07: Advanced Routing and App Initialization](./07-routing-app-init/)

- APP_INITIALIZER and Dependency Injection with inject()
- Functional Guards and HTTP Interceptors
- Route Resolvers with ResolveFn and Signals
- Preloading Strategies and Component Input Bindings
- View Transitions API and Router Animations

### [Module 08: Advanced Testing with Vitest](./08-testing/)

- Component Signal Input Testing with setInput()
- Service Testing with HttpTestingController
- NgRx SignalStore Testing
- Angular Material Test Harnesses
- End-to-End Testing with Playwright

### [Module 09: Optimizing Angular](./09-optimization/)

- Core Web Vitals Measurement with Lighthouse
- Bundle Optimization with esbuild
- Zoneless Change Detection
- Virtual Scrolling and Image Optimization
- Accessibility and Linting

### [Module 10: Server Side Rendering](./10-ssr/)

- SSR with @angular/ssr and Express
- Non-Destructive Hydration
- httpResource() in SSR Context
- Pre-rendering Static Routes
- CSR vs SSR Performance Comparison
