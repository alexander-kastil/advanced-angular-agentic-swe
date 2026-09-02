- Karma is retired in Angular 22. The replacement is the `@angular/build:unit-test` builder, which runs Vitest against the same build graph as the application target.

## angular.json

```json
"test": {
  "builder": "@angular/build:unit-test",
  "options": {
    "tsConfig": "tsconfig.spec.json",
    "buildTarget": "food-shop-ssr:build",
    "setupFiles": ["src/test-setup.ts"]
  }
}
```

- `buildTarget` is what removes the second config: there is no separate bundler setup, no `karma.conf.js`, and no browser launcher.

## package.json

- Removed: `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`, `jasmine-core`, `@types/jasmine`, `istanbul-lib-instrument`.
- Added: `vitest`, `jsdom`.
- `zone.js` went with them. This app is zoneless (`"polyfills": []`), so `zone.js/testing` had nothing to patch.

## tsconfig.spec.json

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*.spec.ts", "src/**/*.d.ts"]
}
```

## The ordering trap

- Every spec that drives an `httpResource` hits this, and it is the single biggest difference from Karma-era specs.

```typescript
TestBed.tick();                  // 1. flush the httpResource effect
http.expectOne(url).flush(body); // 2. only now does the request exist
await fixture.whenStable();      // 3. let the resource publish the value
fixture.detectChanges();         // 4. render it
```

- Awaiting `fixture.whenStable()` **before** `TestBed.tick()` deadlocks. The pending request keeps the application unstable, and the request that would settle it is never flushed.

- Skipping step 3 is the other half of the trap: the flush resolves a promise, so the value is not on the signal until the microtask queue drains. The assertion sees the empty branch and the failure looks like a template bug.

- `TestBed.flushEffects()` is gone. `TestBed.tick()` is its replacement.

## What the old specs got wrong

- The pre-migration specs in this app could not have passed:
    - the `shop-item` spec used `declarations` for a standalone component
    - two specs created components that issue HTTP requests with no HTTP providers at all

- A spec that never ran is worse than a missing spec, because the count in CI looks healthy. Run the suite before trusting a migration:

```bash
npm test
```

## Spec shape for a signal-input component

```typescript
const fixture = TestBed.createComponent(DishParamsComponent);
fixture.componentRef.setInput('id', '2');
fixture.detectChanges();
```

- `componentRef.setInput()` is the only supported way to set a signal input from a test. Assigning to the instance property does not work.
