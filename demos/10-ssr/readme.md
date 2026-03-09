# Server Side Rendering (SSR)

Angular SSR with `@angular/ssr` delivers pre-rendered HTML from an Express server, improving First Contentful Paint and search engine visibility without sacrificing client interactivity. This module demonstrates a complete food shop application using `httpResource()` for reactive data loading, `signal()` for cart state, and `input()`/`output()` for component APIs, all running transparently under SSR. You will compare CSR and SSR build output using Lighthouse, enable non-destructive hydration, and set up pre-rendering for static routes.

## Demos

| #   | Feature                         | Title                     | Teaches                                                                                                                                                          | Topic            |
| --- | ------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| 1   | `/food`                         | SSR Data Loading          | Fetch product data with httpResource() in an SSR context. Compare First Contentful Paint between the CSR dev server and the SSR production build.                | SSR Fundamentals |
| 2   | `/food/:id`                     | Route Params as Signals   | Use toSignal() with ActivatedRoute to bind route parameters reactively in an SSR app. httpResource() automatically refetches when the signal value changes.      | SSR Fundamentals |
| 3   | `server.ts` + app.config.server | SSR Configuration         | Configure @angular/ssr with Express, provideServerRendering(), and CommonEngine. Understand the separation between client and server application configurations. | SSR Setup        |
| 4   | `provideClientHydration()`      | Non-Destructive Hydration | Enable non-destructive hydration so that server-rendered HTML is reused on the client without re-rendering. Observe DOM reuse in browser DevTools.               | SSR Setup        |
| 5   | `routes.txt`                    | Pre-rendering             | Declare routes in routes.txt for build-time static pre-rendering. Inspect the generated HTML files and compare with dynamic SSR output.                          | Performance      |
| 6   | Lighthouse Audit                | CSR vs SSR Comparison     | Build the production SSR bundle and run Lighthouse audits. Measure the FCP improvement and reduced Time to Interactive compared to client-only rendering.        | Performance      |

## Quick Start

The food-shop-ssr app is ready to run. No setup needed — just start the dev server:

```bash
cd demos/10-ssr/food-shop-ssr
npm install
ng serve --open
```

This starts `ng dev` on `localhost:4200`. Open DevTools console and note the **First Contentful Paint (FCP)** timing.

## Creating Angular 21 SSR Projects From Scratch

If you want to create a new SSR application from scratch, use the Angular CLI:

```bash
ng new myapp-ssr --ssr=true --routing --style=scss
cd myapp-ssr
```

In Angular 21+, SSR is enabled by default. SSR can be added to existing projects:

```bash
ng add @angular/ssr
```

This installs:

- **@angular/ssr** — SSR compilation and hydration
- **express** — production Node.js server
- **@types/node** — Node.js type definitions
- **server.ts** — Express configuration

## Modern Component Patterns (Angular v21+)

The food-shop-ssr app demonstrates modern Angular v21+ component patterns using signals, httpResource, and OnPush change detection. All components follow these conventions:

### Key Components

**FoodListComponent** — Main product listing with cart management

```typescript
export class FoodListComponent {
  food = httpResource<FoodItem[]>(() => `${environment.api}food`);
  cart = signal<FoodCartItem[]>([]);

  updateCart(cartItem: FoodCartItem) {
    this.cart.update(items => {
      const idx = items.findIndex(i => i.id === cartItem.id);
      if (idx >= 0) {
        return items.map((i, index) => index === idx ? cartItem : i);
      }
      return [...items, cartItem];
    });
  }
}
```

- **httpResource()** for reactive data fetching with automatic loading state
- **signal()** for client-side state management (cart items)
- **signal.update()** for immutable state updates
- **ChangeDetectionStrategy.OnPush** reduces change detection cycles

**ShopItemComponent** — Product card with signal-based inputs/outputs

```typescript
export class ShopItemComponent {
  readonly food = input.required<FoodItem>();
  readonly inCart = input<number>(0);
  readonly itemChanged = output<FoodCartItem>();

  readonly quantity = signal<number>(0);

  constructor() {
    effect(() => {
      this.quantity.set(this.inCart());
    });
  }

  handleAmountChange(amount: number) {
    this.quantity.set(amount);
    const item: FoodCartItem = { ...this.food(), quantity: amount };
    this.itemChanged.emit(item);
  }
}
```

- **input()** and **input.required()** replace `@Input()` decorator
- **output()** replaces `@Output()` decorator with signal semantics
- **effect()** syncs prop changes to internal state (alternative to ngOnChanges)
- **input()** values are called as functions (reactive semantics)

**FoodDetailsComponent** — Dynamic detail view with route params as signals

```typescript
export class FoodDetailsComponent {
  private route = inject(ActivatedRoute);
  private id = toSignal(
    this.route.paramMap.pipe(map(params => Number(params.get('id'))))
  );
  item = httpResource<FoodItem>(() => `${environment.api}food/${this.id()}`);
}
```

- **inject(ActivatedRoute)** replaces constructor parameter injection
- **toSignal()** converts Observable route params to a signal
- **httpResource()** reactively refetches when route ID changes (called as function)
- No manual .subscribe() needed — httpResource handles cleanup

**NumberPickerComponent** — Pure signal-based reusable component

```typescript
export class NumberPickerComponent {
  readonly increment = input<number>(1);
  readonly initialValue = input<number>(0);
  readonly amountChanged = output<number>();

  readonly quantity = signal<number>(this.initialValue());
  readonly disabled = signal<boolean>(false);
  readonly touched = signal<boolean>(false);
}
```

- All component logic uses signals — no observable subscriptions
- Inputs are derived values (inputs are signals internally)
- Perfect for form controls and reusable UI patterns

### Architecture Principles

| Feature                  | Implementation                                               |
| ------------------------ | ------------------------------------------------------------ |
| **Inputs/Outputs**       | `input()`, `input.required()`, `output()` signals            |
| **State Management**     | `signal()` for local state, `httpResource()` for data        |
| **Change Detection**     | Always `ChangeDetectionStrategy.OnPush`                      |
| **Dependency Injection** | `inject()` function in component body                        |
| **Side Effects**         | `effect()` for reactions to signal changes                   |
| **Data Loading**         | `httpResource()` for HTTP with built-in loading state        |
| **Route Parameters**     | `toSignal(route.paramMap)` to convert to signals             |
| **Template Syntax**      | `@if`, `@for`, `@switch` (no `*ngIf`, `*ngFor`, `*ngSwitch`) |

### Type Safety

**FoodItem** — Product data interface

```typescript
export interface FoodItem {
  id: number;
  name: string;
  price: number;
  inStock: number;
  code?: string;
  pictureUrl?: string;
  description?: string;
}
```

**FoodCartItem** — Shopping cart item with quantity

```typescript
export interface FoodCartItem extends FoodItem {
  quantity: number;
}
```

## Running the Food Shop SSR App

### Development Mode (Client-Side Rendering)

Start the development server with full hot-module reloading:

```bash
cd demos/10-ssr/food-shop-ssr
ng serve --open
```

This runs on `http://localhost:4200`. Open DevTools console and note the **First Contentful Paint (FCP)** timing — content is rendered by client-side JavaScript initially.

### Production Mode (Server-Side Rendering)

Build and serve via Express server (Node SSR):

```bash
cd demos/10-ssr/food-shop-ssr
ng build -c production
npm run serve:ssr:food-shop-ssr
```

This runs Express server on `http://localhost:4000`. Compare vs. development:

- **FCP timing** is significantly faster (server delivers fully-rendered HTML)
- **HTML source** contains pre-rendered markup (view page source)
- **Lighthouse audit** shows reduced scripting time and faster Core Web Vitals
- **Network tab** shows HTML document loaded with complete content

### Key Configuration Files

**app.routes.ts** — Route definitions for food list and detail views

```typescript
export const foodRoutes: Routes = [
  { path: '', component: FoodListComponent },
  { path: 'food/:id', component: FoodDetailsComponent }
];
```

**server.ts** — Express SSR configuration with CommonEngine rendering

```typescript
const commonEngine = new CommonEngine();
server.get('*', (req, res, next) => {
  // Server renders Angular on each request
  const { protocol, originalUrl, baseUrl, headers } = req;
  // ...renders to HTML
});
```

**app.config.ts** — Application configuration with providers

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(foodRoutes),
    provideClientHydration(),
    provideAnimations()
  ]
};
```

- **provideClientHydration()** enables seamless server-to-client transition
- **provideHttpClient(withFetch())** uses native Fetch API instead of XMLHttpRequest
- **provideRouter()** registers route configuration
- **provideAnimations()** enables Angular Material animations

## Pre-rendering Static Routes for Maximum Performance

Pre-rendering generates static HTML files at build time. This combines SSR benefits with static site performance and enables offline access.

### routes.txt — Define Pre-rendered Routes

The `routes.txt` file lists routes to pre-render during production build:

```
/
/food/1
/food/2
/food/3
```

Each route generates a static HTML file at build time, eliminating the need for server computation.

### angular.json Configuration

The `build` target is configured for pre-rendering in `angular.json`:

```json
"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
    "prerender": {
      "routesFile": "routes.txt"
    }
  }
}
```

### Build & Pre-render Production

Execute the production build with pre-rendering:

```bash
ng build -c production
```

This generates:

- `/dist/food-shop-ssr/browser/index.html` — Pre-rendered home page
- `/dist/food-shop-ssr/browser/food/1/index.html` — Pre-rendered food detail page
- `/dist/food-shop-ssr/browser/food/2/index.html` — Pre-rendered food detail page
- `/dist/food-shop-ssr/browser/food/3/index.html` — Pre-rendered food detail page

Inspect these `.html` files — they contain fully-rendered markup with no JavaScript placeholders.

### Serve Pre-rendered App

Run the Express server with pre-rendered static files:

```bash
npm run serve:ssr:food-shop-ssr
```

- Pre-rendered routes are served instantly (no server computation)
- Non-pre-rendered routes (e.g., `/food/999`) fall back to dynamic server rendering
- Browser hydration attaches event listeners seamlessly

### Pre-rendering Performance Benefits

| Metric              | Client-only (ng serve) | SSR (ng build + serve:ssr) | Pre-rendered (routes.txt)           |
| ------------------- | ---------------------- | -------------------------- | ----------------------------------- |
| **FCP**             | ~1-2s                  | ~300-500ms                 | ~100ms                              |
| **TTI**             | ~3-5s                  | ~800ms                     | ~600ms                              |
| **Server CPU**      | N/A                    | Per-request                | Only non-cached routes              |
| **Offline Support** | ❌                     | ❌                         | ✅ Pre-rendered routes work offline |

### When to Pre-render

- **✅ Do pre-render:** Static product pages, home page, documentation
- **❌ Don't pre-render:** User dashboards, real-time data, personalized content

## Key Takeaways

### SSR vs. CSR Performance Comparison

The food-shop-ssr app demonstrates SSR benefits:

1. **Client-Side Rendering (CSR)** — `ng serve`
   - Browser downloads empty HTML + JavaScript bundle
   - Browser executes Angular to render component tree
   - Visible content requires JavaScript parsing and execution
   - User sees blank page until JavaScript loads and runs

2. **Server-Side Rendering (SSR)** — `ng build` + `npm run serve:ssr:food-shop-ssr`
   - Server sends fully-rendered HTML on first request
   - Browser can display content immediately (faster FCP)
   - JavaScript enhances with interactivity via hydration
   - Better perceived performance and SEO

3. **Static Pre-rendering** — with `routes.txt`
   - Static HTML generated at build time
   - Served instantly — no server computation needed
   - Best performance for static product/marketing pages
   - Scales infinitely (served by CDN, no server)

### SSR Architecture

The food-shop-ssr app uses this SSR stack:

```
Angular CLI (ng build)
  ↓ (compiles Angular for Node.js)
dist/food-shop-ssr/server/
  ↓ (CommonEngine renders components)
Express.js Server (server.ts)
  ↓ (HTTP responses with rendered HTML)
Browser (hydration attaches event listeners)
```

**App Configuration for SSR:**

- **CommonEngine** (from `@angular/ssr`) executes Angular on server
- **Express.js** provides HTTP server with middleware
- **provideClientHydration()** enables seamless server-to-browser transition
- **provideHttpClient(withFetch())** uses Fetch API (Node.js compatible)

### Modern Component Patterns in food-shop-ssr

1. **Signal-Based State**

   ```typescript
   cart = signal<FoodCartItem[]>([]);
   quantity = signal<number>(0);
   ```

   - Simple, synchronous state management
   - No async subscription complexity

2. **Reactive Data Loading**

   ```typescript
   food = httpResource<FoodItem[]>(() => `${environment.api}food`);
   ```

   - Built-in loading/error states
   - Automatic cleanup on component destroy
   - Reactive updates when dependencies change

3. **Signal Inputs & Outputs**

   ```typescript
   readonly food = input.required<FoodItem>();
   readonly itemChanged = output<FoodCartItem>();
   ```

   - Type-safe prop bindings
   - Simpler than `@Input()/@Output()` decorators
   - Called as functions in component logic

4. **Route Parameters as Signals**

   ```typescript
   private id = toSignal(this.route.paramMap.pipe(...));
   item = httpResource<FoodItem>(() => `${environment.api}food/${this.id()}`);
   ```

   - Convert Observable params to signals
   - Trigger dependent data loads when route changes

### SSR Best Practices

✅ **Do:**

- Use `ChangeDetectionStrategy.OnPush` to reduce rendering overhead
- Leverage `httpResource()` for server-compatible async data
- Pre-render static routes in `routes.txt`
- Use `provideClientHydration()` for seamless SSR
- Keep components pure (no browser API dependencies)
- Use `isPlatformBrowser()` if browser APIs are needed
- Test SSR builds locally before deployment
- Monitor Core Web Vitals (FCP, LCP, INP, CLS)

❌ **Don't:**

- Use `window`, `document`, or `localStorage` without guards
- Subscribe to Observables directly in components (use `httpResource()` or `toSignal()`)
- Use `ChangeDetectionStrategy.Default` (expensive on server)
- Pre-render routes with real-time data or user-specific content
- Assume browser APIs are available on server

### Angular 21+ Features Used in food-shop-ssr

| Feature                            | Benefit                                                     |
| ---------------------------------- | ----------------------------------------------------------- |
| **Standalone Components**          | Tree-shakeable, better bundling                             |
| **Signal Inputs/Outputs**          | Type-safe, reactive prop binding                            |
| **httpResource()**                 | Automatic loading state, error handling, reactivity         |
| **toSignal()**                     | Convert Observable params/subscriptions to signals          |
| **effect()**                       | React to signal changes without explicit subscriptions      |
| **ChangeDetectionStrategy.OnPush** | Reduced change detection cycles — critical for SSR          |
| **@if / @for / @switch**           | Modern control flow, better performance than `*ngIf/*ngFor` |
| **ngOptimizedImage**               | Automatic image optimization for Core Web Vitals            |
| **provideClientHydration()**       | Seamless SSR hydration without re-rendering                 |

## Related Topics

- [Angular Signals Documentation](https://angular.dev/guide/signals)
- [Angular SSR Guide](https://angular.dev/guide/ssr)
- [Client Hydration](https://angular.dev/guide/hydration)
- [ngOptimizedImage for core web vitals](https://angular.dev/guide/image-optimization#)
- [Web Vitals and Performance Monitoring](https://web.dev/articles/user-centric-performance-metrics)
