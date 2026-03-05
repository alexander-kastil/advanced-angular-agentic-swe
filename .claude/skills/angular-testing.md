# Angular Testing with Vitest (v21+)

## Project Setup (Required Files)

Three files must be configured correctly. Using the wrong approach causes Angular template compilation to fail silently.

### 1. `angular.json` — use `tsConfig` + `buildTarget`, NOT `runnerConfig`

```json
"test": {
  "builder": "@angular/build:unit-test",
  "options": {
    "tsConfig": "tsconfig.spec.json",
    "buildTarget": "<project-name>:build"
  }
}
```

**Do NOT use `runnerConfig: "vitest.config.ts"`** — it bypasses Angular's compiler pipeline and component templates will not compile.

### 2. `tsconfig.spec.json`

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["vitest/globals"]
  },
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ]
}
```

### 3. `vitest.config.ts`

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
  },
});
```

**Do NOT set `environment: 'jsdom'`** — the Angular builder configures the test environment. Setting it explicitly conflicts.

### Commands

```bash
ng test              # run once
ng test --watch      # watch mode
ng test --code-coverage
```

---

## Imports — Always Explicit

Every spec file must import from `'vitest'` explicitly. Do not rely on globals even though `globals: true` is set — explicit imports make the testing framework visible to students and tools.

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
```

Only import what the file uses. Common combinations:
- Pure class/service: `describe, it, expect, beforeEach`
- With spies: add `vi`
- With teardown: add `afterEach`

---

## Basic Component Test

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('MyComponent', () => {
  let fixture: ComponentFixture<MyComponent>;
  let component: MyComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [
        { provide: MyService, useValue: { getData: vi.fn().mockReturnValue(of([])) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sets signal input', () => {
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('expected');
  });
});
```

---

## Spying on Services — Order Matters

**Critical:** `toSignal()` and `resource()` run in the constructor. If you spy on a service method that is called during construction, the spy **must be set up before `createComponent`**.

### Wrong — spy is too late:
```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({ ... }).compileComponents();
  fixture = TestBed.createComponent(MyComponent); // constructor runs here
  service = TestBed.inject(MyService);
});

it('shows data', () => {
  vi.spyOn(service, 'getData').mockReturnValue(of(true)); // too late!
  fixture.detectChanges();
});
```

### Correct — spy before createComponent:
```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({ ... }).compileComponents();
  service = TestBed.inject(MyService); // inject first
});

it('shows data', () => {
  vi.spyOn(service, 'getData').mockReturnValue(of(true)); // spy before create
  fixture = TestBed.createComponent(MyComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
});
```

---

## Mocking Signal-Based Services

When a service method returns a **signal** (not an Observable), mock it with a signal:

```typescript
import { signal } from '@angular/core';

// WRONG — service returns a signal, not an Observable
foodServiceSpy = { getFood: vi.fn().mockReturnValue(of(data)) };

// CORRECT
const foodSignal = signal(data);
foodServiceSpy = { getFood: vi.fn().mockReturnValue(foodSignal.asReadonly()) };
```

For services where the signal is read at construction time, set up the mock in `beforeEach` before creating the component:

```typescript
const mockAuth = {
  user: signal<User | null>(null),
  isAuthenticated: computed(() => mockAuth.user() !== null),
  login: vi.fn(),
  logout: vi.fn(),
};

providers: [{ provide: AuthService, useValue: mockAuth }]

// In test — set signal value then detect changes:
mockAuth.user.set({ id: '1', name: 'Test' });
fixture.detectChanges();
expect(fixture.nativeElement.querySelector('.content')).toBeTruthy();
```

---

## Testing Effects

`effect()` runs asynchronously — use `TestBed.flushEffects()` to flush pending effects in tests.

```typescript
import { signal, effect, Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';

let injector: Injector;

beforeEach(() => {
  TestBed.configureTestingModule({});
  injector = TestBed.inject(Injector);
});

it('runs effect when signal changes', () => {
  const count = signal(0);
  const log: number[] = [];
  let stopEffect: ReturnType<typeof effect> | undefined;

  runInInjectionContext(injector, () => {
    stopEffect = effect(() => log.push(count()));
  });

  TestBed.flushEffects(); // flush initial run
  expect(log).toContain(0);

  count.set(5);
  TestBed.flushEffects();
  expect(log).toContain(5);

  stopEffect?.destroy();
});
```

---

## Async Testing with Vitest Fake Timers

Use `vi.useFakeTimers()` / `vi.useRealTimers()` instead of Angular's `fakeAsync`/`tick`.

```typescript
it('debounces input', () => {
  vi.useFakeTimers();
  component.query.set('test');
  vi.advanceTimersByTime(300);
  fixture.detectChanges();
  expect(component.results().length).toBeGreaterThan(0);
  vi.useRealTimers();
});

it('handles observable with delay', () => {
  vi.useFakeTimers();
  fixture.detectChanges();
  vi.advanceTimersByTime(300);
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('Loaded');
  vi.useRealTimers();
});
```

For promise-based async, use `async/await` + `fixture.whenStable()`:

```typescript
it('loads async data', async () => {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  expect(component.data()).toBeDefined();
});
```

---

## HTTP Testing

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

let httpMock: HttpTestingController;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
  httpMock = TestBed.inject(HttpTestingController);
});

afterEach(() => httpMock.verify());

it('fetches data', () => {
  service.getUsers().subscribe(users => expect(users).toEqual(mockUsers));
  const req = httpMock.expectOne('/api/users');
  expect(req.request.method).toBe('GET');
  req.flush(mockUsers);
});
```

## httpResource Testing

```typescript
it('displays data after load', () => {
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('Loading');
  httpMock.expectOne('/api/users/1').flush({ id: '1', name: 'John' });
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('John');
});
```

---

## Signal / Computed Testing

```typescript
import { describe, it, expect } from 'vitest';
import { signal, computed } from '@angular/core';

it('updates computed when signal changes', () => {
  const count = signal(0);
  const doubled = computed(() => count() * 2);
  expect(doubled()).toBe(0);
  count.set(5);
  expect(doubled()).toBe(10);
});
```

---

## Rules

- Always import from `'vitest'` explicitly — never rely on globals
- Use `tsConfig` + `buildTarget` in `angular.json`, never `runnerConfig`
- Never set `environment: 'jsdom'` in `vitest.config.ts`
- Spy on services **before** `createComponent` when the method is called in the constructor
- Mock signal-returning methods with `signal().asReadonly()`, not `of()`
- Call `TestBed.flushEffects()` after registering effects before asserting
- Use `vi.useFakeTimers()` / `vi.advanceTimersByTime()` instead of `fakeAsync`/`tick`
- Always `httpMock.verify()` in `afterEach`
- Use `vi.clearAllMocks()` in `beforeEach` when reusing spies across tests
- Use `fixture.componentRef.setInput()` for signal inputs
- Never test private methods — test behavior and output
