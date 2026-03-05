---
name: ng-register-vitest
description: Step-by-step guide for migrating Angular projects from Karma/Jasmine to Vitest (Angular v20/21+). Includes dependency management, configuration setup, test file API migration, and best practices for zoneless/OnPush testing.
---

# Register Vitest and Migrate from Karma/Jasmine

## Overview

This skill guides coding agents through migrating an existing Angular project from **Karma + Jasmine** to **Vitest** with modern patterns (OnPush + Zoneless). The process involves removing legacy dependencies, configuring vitest, and updating test APIs.

**Target Environment:**

- Angular v20.2+
- TypeScript 5.7+
- Node.js 20+

**Benefits:**

- ✅ 10-50x faster test execution (no Zone.js overhead)
- ✅ Native ESM support with esbuild
- ✅ Modern async/await patterns
- ✅ Zoneless-compatible from the start
- ✅ Smaller bundle size in tests

---

## Prerequisites

Before starting, verify:

1. **Angular version** is 20.2 or later
2. **Project is buildable** (`ng build` completes)
3. **All tests currently pass** (baseline for comparison)
4. **Git is initialized** (to track migration diffs)

**Check Angular version:**

```bash
ng version
# Output should show: Angular: 20.x or 21.x
```

---

## Step 1: Remove Karma/Jasmine Dependencies

### 1a. Identify and remove dependencies

Run this to find Karma and Jasmine packages:

```bash
npm list | grep -E "(karma|jasmine)"
```

### 1b. Uninstall Karma and Jasmine

```bash
npm uninstall \
  @angular-devkit/build-angular \
  @angular/cdk \
  @types/jasmine \
  jasmine-core \
  karma \
  karma-chrome-launcher \
  karma-coverage \
  karma-jasmine \
  karma-jasmine-html-reporter
```

**Alternative (Windows PowerShell):**

```powershell
npm uninstall `
  @angular-devkit/build-angular `
  @angular/cdk `
  @types/jasmine `
  jasmine-core `
  karma `
  karma-chrome-launcher `
  karma-coverage `
  karma-jasmine `
  karma-jasmine-html-reporter
```

### 1c. Verify removal

```bash
npm list | grep -E "(karma|jasmine)"
# Should return empty
```

---

## Step 2: Install Vitest Dependencies

### 2a. Install required packages

```bash
npm install --save-dev \
  vitest@^4.0.0 \
  @analogjs/vitest-angular@^1.18.0 \
  jsdom@^26.0.0
```

### 2b. Verify installation

```bash
npm list vitest @analogjs/vitest-angular jsdom
```

**Expected output:** Should show all three packages installed

---

## Step 3: Create vitest.config.ts

Create file at project root:

**File:** `vitest.config.ts`

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        include: ['src/**/*.spec.ts'],
        setupFiles: ['src/test-setup.ts'],
        environment: 'jsdom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'json'],
            exclude: ['node_modules/', 'dist/']
        }
    },
});
```

**Key options:**

- `globals: true` – No need to import `describe`, `it`, `expect`
- `include` – Pattern for test files (must match `*.spec.ts`)
- `setupFiles` – Files to run before tests (TestBed initialization)
- `jsdom` – Browser environment simulation for testing

---

## Step 4: Create Test Setup File

Create file at `src/test-setup.ts`:

```typescript
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { getTestBed } from '@angular/core/testing';

let testBedInitialized = false;

if (!testBedInitialized) {
    getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
    testBedInitialized = true;
}
```

This initializes the TestBed environment before tests run.

---

## Step 5: Update tsconfig.spec.json

Update TypeScript types to use Vitest instead of Jasmine:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": [
      "vitest/globals"
    ]
  },
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ]
}
```

**Changes from Karma/Jasmine:**

- Remove: `"types": ["jasmine"]`
- Add: `"types": ["vitest/globals"]`

---

## Step 6: Update angular.json Test Configuration

Update the `test` builder in `angular.json`:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "tsConfig": "tsconfig.spec.json",
            "buildTarget": "my-app:build"
          }
        }
      }
    }
  }
}
```

**Using Angular CLI to update (recommended):**

Run this command to regenerate the test configuration automatically:

```bash
ng build --configuration=test
```

Or manually edit:

1. Find `"test"` builder (currently points to `@angular-devkit/build-angular:karma`)
2. Replace with `"@angular/build:unit-test"`
3. Simplify options:
   - Remove `karmaConfig` property
   - Keep only `tsConfig` and `buildTarget`

---

## Step 7: Update package.json Test Script

In `package.json`, verify the test script:

```json
{
  "scripts": {
    "test": "ng test"
  }
}
```

This automatically uses `@angular/build:unit-test` (Vitest) via angular.json.

---

## Step 8: Migrate Test File APIs

### 8a. Spy and Mock Syntax

| Jasmine                  | Vitest                    | Reason              |
| ------------------------ | ------------------------- | ------------------- |
| `spyOn(obj, 'method')`   | `vi.spyOn(obj, 'method')` | Vitest spy syntax   |
| `.and.returnValue(x)`    | `.mockReturnValue(x)`     | Mock implementation |
| `.and.callFake(fn)`      | `.mockImplementation(fn)` | Custom mock logic   |
| `jasmine.createSpyObj()` | `{ method: vi.fn() }`     | Manual mock objects |

**Example Migration:**

```typescript
// Before (Jasmine)
beforeEach(() => {
  const userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);
  userServiceSpy.getUser.and.returnValue(of({ id: 1, name: 'Test' }));
});

// After (Vitest)
beforeEach(() => {
  const userServiceSpy = {
    getUser: vi.fn().mockReturnValue(of({ id: 1, name: 'Test' }))
  };
});
```

### 8b. Async Patterns

| Jasmine             | Vitest                       | Notes                |
| ------------------- | ---------------------------- | -------------------- |
| `waitForAsync()`    | `async/await`                | Native async/await   |
| `fakeAsync()`       | `vi.useFakeTimers()`         | Manual timer control |
| `tick(ms)`          | `vi.advanceTimersByTime(ms)` | Advance timers       |
| `flush()`           | `vi.runAllTimers()`          | Run all pending      |
| `flushMicrotasks()` | `await Promise.resolve()`    | Flush microtasks     |

**Example Migration:**

```typescript
// Before (Jasmine with fakeAsync)
it('waits for async operation', fakeAsync(() => {
  component.loadData();
  tick(1000);
  expect(component.data).toBeDefined();
}));

// After (Vitest with timers)
it('waits for async operation', () => {
  vi.useFakeTimers();
  component.loadData();
  vi.advanceTimersByTime(1000);
  expect(component.data).toBeDefined();
  vi.useRealTimers();
});

// Or with native async/await
it('waits for async operation', async () => {
  component.loadData();
  await new Promise(resolve => setTimeout(resolve, 1000));
  expect(component.data).toBeDefined();
});
```

### 8c. DOM and Assertion Changes

| Jasmine           | Vitest                        |
| ----------------- | ----------------------------- |
| `toBeTrue()`      | `toBe(true)`                  |
| `toBeFalse()`     | `toBe(false)`                 |
| `toHaveSize(n)`   | `toHaveLength(n)`             |
| `.innerText`      | `.textContent` (jsdom)        |
| `toContain(a, b)` | `expect([a, b]).toContain(x)` |

---

## Step 9: Remove Old Karma Configuration Files

Delete these files if they exist:

```bash
rm -f karma.conf.js          # Karma config
rm -f src/karma-test-shim.js # Old test shim
```

Or in PowerShell:

```powershell
Remove-Item -Path 'karma.conf.js' -ErrorAction SilentlyContinue
Remove-Item -Path 'src/karma-test-shim.js' -ErrorAction SilentlyContinue
```

---

## Step 10: Run Tests and Validate

### 10a. Execute tests

```bash
npm test
# or
ng test
```

### 10b. Expected output

```
✓ src/app/app.component.spec.ts (3)
✓ src/app/services/user.service.spec.ts (5)
...
✓ 40 files, 127 tests passed (0.5s)
```

### 10c. Check test coverage

```bash
npm test -- --coverage
```

---

## Step 11: Update All Test Files (Batch Approach)

For projects with many tests, use a systematic approach:

### 11a. Identify all test files

```bash
find src -name "*.spec.ts" -type f | wc -l
```

### 11b. Audit API usage in tests

```bash
# Find jasmine.createSpyObj usage
grep -r "jasmine.createSpyObj" src --include="*.spec.ts"

# Find fakeAsync usage
grep -r "fakeAsync" src --include="*.spec.ts"

# Find spyOn usage (needs vi.spyOn)
grep -r "spyOn" src --include="*.spec.ts"
```

### 11c. Migration priority

1. **First:** Test utility files and base specs
2. **Second:** Service specs (no UI dependencies)
3. **Third:** Component specs (depends on refactored services)
4. **Last:** Integration tests

---

## Common Issues and Solutions

### Issue 1: Test Hangs or Timeout

**Symptom:** Tests timeout or hang after migration

**Solution:**

1. Check for missing `vi.useRealTimers()` after fake timer tests
2. Ensure `await fixture.whenStable()` is used for async operations
3. Verify no `setTimeout` without proper cleanup in `afterEach`

```typescript
// ✅ Correct
afterEach(() => {
  vi.useRealTimers(); // Reset timers
  vi.clearAllMocks();  // Clear all spies
});
```

### Issue 2: DOM not Updating in Tests

**Symptom:** Template changes not reflected in test assertions

**Solution:**

- Use `await fixture.whenStable()` instead of manual `tick()`
- Call `fixture.detectChanges()` after state changes

```typescript
// ✅ Correct for OnPush components
it('updates on input change', async () => {
  fixture.componentRef.setInput('data', newData);
  fixture.detectChanges();
  await fixture.whenStable();
  expect(fixture.nativeElement.textContent).toContain('updated');
});
```

### Issue 3: AsyncScheduler RxJS Tests Failing

**Symptom:** RxJS asyncScheduler tests fail with real timers

**Solution:**
Use `vi.useFakeTimers()` for async scheduler operations:

```typescript
it('emits on asyncScheduler', () => {
  vi.useFakeTimers();
  // AsyncScheduler operations here
  vi.runAllTimers();
  expect(...).toBe(...);
  vi.useRealTimers();
});
```

### Issue 4: TestBed is Not Initialized

**Symptom:** Error: "TestBed is not initialized"

**Solution:**

- Verify `src/test-setup.ts` exists
- Check `vitest.config.ts` includes `setupFiles: ['src/test-setup.ts']`
- Rebuild project: `npx tsc --noEmit`

### Issue 5: Vitest Can't Find Module

**Symptom:** Error: "Cannot find module '@angular/core'"

**Solution:**

1. Clear node_modules: `rm -rf node_modules && npm install`
2. Verify all dependencies are installed
3. Check paths in `tsconfig.json` are correct

---

## Testing with Zoneless

For applications using `provideZonelessChangeDetection()`:

```typescript
// In your test setup or individual tests
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyComponent],
    providers: [provideZonelessChangeDetection()]
  }).compileComponents();
});

it('works with zoneless', async () => {
  const fixture = TestBed.createComponent(MyComponent);
  fixture.detectChanges();
  await fixture.whenStable();

  // Signal updates trigger change detection automatically
  component.count.set(5);
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('5');
});
```

---

## Best Practices for Vitest Migration

### ✅ Use Modern Patterns

```typescript
// Good: Direct signal testing
it('signal updates', () => {
  const count = signal(0);
  count.set(5);
  expect(count()).toBe(5);
});

// Good: Using async/await
it('loads data', async () => {
  await component.loadData();
  expect(component.data).toBeDefined();
});
```

### ❌ Avoid Legacy Patterns

```typescript
// Bad: Relying on zone.js
it('handles zone events', (done) => {
  setTimeout(() => {
    expect(...).toBe(...);
    done(); // Don't use done callback
  }, 100);
});
```

### ✅ Proper Cleanup

```typescript
afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
  vi.clearAllTimers();
});
```

---

## Verification Checklist

- [ ] Dependencies removed: `npm list | grep karma` returns empty
- [ ] Dependencies installed: `npm list vitest` shows v4+
- [ ] `vitest.config.ts` exists at project root
- [ ] `src/test-setup.ts` exists and initializes TestBed
- [ ] `tsconfig.spec.json` has `"types": ["vitest/globals"]`
- [ ] `angular.json` test builder is `@angular/build:unit-test`
- [ ] No `karma.conf.js` in project root
- [ ] `npm test` runs without errors
- [ ] Test output shows: "X files, X tests passed"
- [ ] All test APIs updated (no `jasmine.`, no `fakeAsync`)

---

## References

- [Vitest Docs](https://vitest.dev/)
- [@analogjs/vitest-angular](https://github.com/analogjs/analog/tree/main/packages/ng-vitest)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [TestBed API](https://angular.dev/api/core/testing/TestBed)
- [Vitest Assertion Matchers](https://vitest.dev/api/expect.html)
