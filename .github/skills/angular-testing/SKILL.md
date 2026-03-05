---
name: angular-testing
description: Write unit and integration tests for Angular v20+ applications using Vitest or Jasmine with TestBed and modern testing patterns. Use for testing components with signals, OnPush change detection, services with inject(), and HTTP interactions. Triggers on test creation, testing signal-based components, mocking dependencies, or setting up test infrastructure. Don't use for E2E testing with Cypress or Playwright, or for testing non-Angular JavaScript/TypeScript code.
---

# Angular Testing

Test Angular v20+ applications with Vitest (recommended) or Jasmine, focusing on signal-based components and modern patterns.

## Vitest Setup (Angular v20+)

Angular v20+ has native Vitest support through the `@angular/build` package.

### Installation

```bash
npm install -D vitest jsdom
```

### Configure angular.json (Critical Setup)

**Three files must be configured correctly.** Using the wrong approach causes Angular template compilation to fail silently.

Use `tsConfig` + `buildTarget`, NOT `runnerConfig`:

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

### Configure tsconfig.spec.json

Update compiler types for Vitest globals:

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

### Create test-setup.ts

Create `src/test-setup.ts` to initialize Angular TestBed (required for all tests):

```typescript
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
```

### Configure vitest.config.ts

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

### Run Tests

```bash
ng test              # Run tests once
ng test --watch      # Watch mode (recommended for development)
ng test --code-coverage  # With coverage report
```

---

## Imports — Always Explicit

Every spec file must import from `'vitest'` explicitly. Do not rely on globals even though `globals: true` is set — explicit imports make the testing framework visible to students and tools and ensure proper type checking.

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
```

Only import what the file uses. Common combinations:

- Pure class/service: `describe, it, expect, beforeEach`
- With spies: add `vi`
- With teardown: add `afterEach`

## Vitest Migration from Jasmine

When migrating existing Jasmine tests to Vitest, use these patterns and replacements.

### Import Updates

Add Vitest globals to test files:

```typescript
// ✅ Vitest (new)
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

// ❌ Old - Remove this
// Don't import jasmine library anymore
```

### Spying on Methods

Replace Jasmine spy syntax with Vitest:

| Jasmine                 | Vitest                                          |
| ----------------------- | ----------------------------------------------- |
| `spyOn(obj, 'method')`  | `vi.spyOn(obj, 'method')`                       |
| `.and.returnValue(val)` | `.mockReturnValue(val)`                         |
| `.and.throwError(err)`  | `.mockRejectedValue(err)`                       |
| `.and.callThrough()`    | `.mockImplementation((args) => original(args))` |

### Migration Example

```typescript
// ❌ Jasmine
describe('MyComponent', () => {
  it('should call service', () => {
    const spy = spyOn(myService, 'fetch').and.returnValue(of(mockData));
    component.loadData();
    expect(spy).toHaveBeenCalledWith('query');
  });
});

// ✅ Vitest
describe('MyComponent', () => {
  let service: MyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [MyService],
    }).compileComponents();
    service = TestBed.inject(MyService);
  });

  it('should call service', () => {
    const spy = vi.spyOn(service, 'fetch').mockReturnValue(of(mockData));
    const component = TestBed.createComponent(MyComponent).componentInstance;
    component.loadData();
    expect(spy).toHaveBeenCalledWith('query');
  });
});
```

### Spying on Component Output Signals

For testing component outputs:

```typescript
@Component({
  selector: 'app-item',
  template: `<button (click)="select()">Select</button>`,
})
export class ItemComponent {
  item = input.required<Item>();
  selected = output<Item>();

  select() {
    this.selected.emit(this.item());
  }
}

describe('ItemComponent', () => {
  it('should emit selected event on click', () => {
    const fixture = TestBed.createComponent(ItemComponent);
    const spy = vi.spyOn(fixture.componentInstance.selected, 'emit');

    fixture.componentRef.setInput('item', { id: '1', name: 'Test' });
    fixture.nativeElement.querySelector('button').click();

    expect(spy).toHaveBeenCalledWith({ id: '1', name: 'Test' });
  });
});
```

### Key Differences from Jasmine

- **Global spyOn unavailable**: Must use `vi.spyOn()` explicitly
- **TestBed still available globally**: From Angular, works unmodified
- **Setup file required**: `test-setup.ts` initializes TestBed for all tests
- **TypeScript types**: Update tsconfig.spec.json to use `vitest/globals`
- **Faster watch mode**: Vitest provides quicker feedback than Karma

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

## Basic Component Test

Following Angular v20+ best practices with standalone components and OnPush change detection:

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Testing Signals

### Direct Signal Testing

```typescript
import { signal, computed } from '@angular/core';

describe('Signal logic', () => {
  it('should update computed when signal changes', () => {
    const count = signal(0);
    const doubled = computed(() => count() * 2);

    expect(doubled()).toBe(0);

    count.set(5);
    expect(doubled()).toBe(10);

    count.update(c => c + 1);
    expect(doubled()).toBe(12);
  });
});
```

### Testing Component Signals

```typescript
@Component({
  selector: 'app-todo-list',
  template: `
    <ul>
      @for (todo of filteredTodos(); track todo.id) {
        <li>{{ todo.text }}</li>
      }
    </ul>
    <p>{{ remaining() }} remaining</p>
  `,
})
export class TodoList {
  todos = signal<Todo[]>([]);
  filter = signal<'all' | 'active' | 'done'>('all');

  filteredTodos = computed(() => {
    const todos = this.todos();
    switch (this.filter()) {
      case 'active': return todos.filter(t => !t.done);
      case 'done': return todos.filter(t => t.done);
      default: return todos;
    }
  });

  remaining = computed(() => this.todos().filter(t => !t.done).length);
}

describe('TodoList', () => {
  let component: TodoList;
  let fixture: ComponentFixture<TodoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoList],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoList);
    component = fixture.componentInstance;
  });

  it('should filter active todos', () => {
    component.todos.set([
      { id: '1', text: 'Task 1', done: false },
      { id: '2', text: 'Task 2', done: true },
      { id: '3', text: 'Task 3', done: false },
    ]);

    component.filter.set('active');

    expect(component.filteredTodos().length).toBe(2);
    expect(component.remaining()).toBe(2);
  });
});
```

## Testing OnPush Components

OnPush components require explicit change detection:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span>{{ data().name }}</span>`,
})
export class OnPushCmpt {
  data = input.required<{ name: string }>();
}

describe('OnPushCmpt', () => {
  it('should update when input signal changes', () => {
    const fixture = TestBed.createComponent(OnPushCmpt);

    // Set input using setInput (for signal inputs)
    fixture.componentRef.setInput('data', { name: 'Initial' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Initial');

    // Update input
    fixture.componentRef.setInput('data', { name: 'Updated' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Updated');
  });
});
```

## Testing Services

### Basic Service Test

```typescript
@Injectable({ providedIn: 'root' })
export class CounterService {
  private _count = signal(0);
  readonly count = this._count.asReadonly();

  increment() { this._count.update(c => c + 1); }
  reset() { this._count.set(0); }
}

describe('CounterService', () => {
  let service: CounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CounterService);
  });

  it('should increment count', () => {
    expect(service.count()).toBe(0);
    service.increment();
    expect(service.count()).toBe(1);
  });
});
```

### Service with HTTP

```typescript
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify no outstanding requests
  });

  it('should fetch user by id', () => {
    const mockUser = { id: '1', name: 'Test User' };

    service.getUser('1').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
```

## Mocking Dependencies

### Using vi.spyOn for Real Services

The recommended approach is to inject the real service and spy on its methods:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';

describe('UserProfile', () => {
  let service: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: [UserService],
    }).compileComponents();

    service = TestBed.inject(UserService);
  });

  it('should call getUser on init', () => {
    const spy = vi.spyOn(service, 'getUser').mockReturnValue(of({ id: '1', name: 'Test' }));

    const fixture = TestBed.createComponent(UserProfile);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('1');
  });
});
```

### Using Full Mock Objects

For complete replacement of services:

```typescript
const mockUserService = {
  getUser: vi.fn(),
  updateUser: vi.fn(),
  user: signal<User | null>(null),
};

beforeEach(async () => {
  vi.clearAllMocks();
  mockUserService.getUser.mockReturnValue(of({ id: '1', name: 'Test' }));

  await TestBed.configureTestingModule({
    imports: [UserProfile],
    providers: [
      { provide: UserService, useValue: mockUserService },
    ],
  }).compileComponents();
});

it('should call getUser on init', () => {
  const fixture = TestBed.createComponent(UserProfile);
  fixture.detectChanges();

  expect(mockUserService.getUser).toHaveBeenCalledWith('1');
});
```

### Mock Signal-Based Service

For services with signals:

```typescript
const mockAuth = {
  user: signal<User | null>(null),
  isAuthenticated: computed(() => mockAuth.user() !== null),
  login: vi.fn(),
  logout: vi.fn(),
};

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [ProtectedPage],
    providers: [
      { provide: AuthService, useValue: mockAuth },
    ],
  }).compileComponents();
});

it('should show content when authenticated', () => {
  mockAuth.user.set({ id: '1', name: 'Test User' });

  const fixture = TestBed.createComponent(ProtectedPage);
  fixture.detectChanges();

  expect(fixture.nativeElement.querySelector('.protected-content')).toBeTruthy();
});
```

## Testing Inputs and Outputs

```typescript
@Component({
  selector: 'app-item',
  template: `<div (click)="select()">{{ item().name }}</div>`,
})
export class ItemCmpt {
  item = input.required<Item>();
  selected = output<Item>();

  select() {
    this.selected.emit(this.item());
  }
}

describe('ItemCmpt', () => {
  it('should emit selected event on click', () => {
    const fixture = TestBed.createComponent(ItemCmpt);
    const item: Item = { id: '1', name: 'Test Item' };

    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();

    let emittedItem: Item | undefined;
    fixture.componentInstance.selected.subscribe(i => emittedItem = i);

    fixture.nativeElement.querySelector('div').click();

    expect(emittedItem).toEqual(item);
  });
});
```

## Testing Async Operations

### Using Vitest Fake Timers (Recommended)

Use `vi.useFakeTimers()` / `vi.useRealTimers()` instead of Angular's `fakeAsync`/`tick`:

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

### Using fakeAsync

For time-dependent tests that require Angular's async utilities:

```typescript
import { fakeAsync, tick, flush } from '@angular/core/testing';

it('should debounce search', fakeAsync(() => {
  const fixture = TestBed.createComponent(SearchCmpt);
  fixture.detectChanges();

  fixture.componentInstance.query.set('test');

  tick(300); // Advance time for debounce
  fixture.detectChanges();

  expect(fixture.componentInstance.results().length).toBeGreaterThan(0);

  flush(); // Flush remaining timers
}));
```

### Using waitForAsync

```typescript
import { waitForAsync } from '@angular/core/testing';

it('should load data', waitForAsync(() => {
  const fixture = TestBed.createComponent(DataCmpt);
  fixture.detectChanges();

  fixture.whenStable().then(() => {
    fixture.detectChanges();
    expect(fixture.componentInstance.data()).toBeDefined();
  });
}));
```

## Testing HTTP Resources

```typescript
@Component({
  template: `
    @if (userResource.isLoading()) {
      <p>Loading...</p>
    } @else if (userResource.hasValue()) {
      <p>{{ userResource.value().name }}</p>
    }
  `,
})
export class UserCmpt {
  userId = signal('1');
  userResource = httpResource<User>(() => `/api/users/${this.userId()}`);
}

describe('UserCmpt', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCmpt],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should display user name after loading', () => {
    const fixture = TestBed.createComponent(UserCmpt);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loading');

    const req = httpMock.expectOne('/api/users/1');
    req.flush({ id: '1', name: 'John Doe' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('John Doe');
  });
});
```

---

## Rules

Follow these rules to avoid common testing pitfalls:

- **Always import from `'vitest'` explicitly** — never rely on globals, even though `globals: true` is set
- **Use `tsConfig` + `buildTarget` in `angular.json`**, never `runnerConfig` — it bypasses Angular's compiler
- **Never set `environment: 'jsdom'` in `vitest.config.ts`** — the Angular builder configures this
- **Spy on services BEFORE `createComponent`** when the method is called in the constructor
- **Mock signal-returning methods with `signal().asReadonly()`**, not `of()`
- **Call `TestBed.flushEffects()` after registering effects** before asserting
- **Use `vi.useFakeTimers()` / `vi.advanceTimersByTime()`** instead of `fakeAsync`/`tick` with Vitest
- **Always `httpMock.verify()` in `afterEach`** to catch outstanding HTTP requests
- **Use `vi.clearAllMocks()` in `beforeEach`** when reusing spies across tests
- **Use `fixture.componentRef.setInput()`** for signal inputs
- **Never test private methods** — test behavior and output
- **Always use `fixture.detectChanges()`** explicitly with OnPush components

---

## Best Practices & Recommendations

### Vitest vs Jasmine

**Use Vitest for new projects.** It provides:

- No Karma server dependency
- Faster test execution
- Better TypeScript support
- Modern JavaScript tooling
- Native module support

### Test Organization

1. **One spec file per component/service**: `component.spec.ts` adjacent to `component.ts`
2. **Setup services in `beforeEach`**: Initialize TestBed and inject dependencies
3. **Use meaningful test names**: Describe behavior, not implementation
4. **Keep tests focused**: One assertion per test when possible
5. **Mock external dependencies**: HTTP, localStorage, timers, etc.

### Common Patterns

**Always use standalone components:**

```typescript
@Component({
  selector: 'app-example',
  template: '...',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ...],
})
export class ExampleComponent { }
```

**Always use OnPush for testability:**

```typescript
changeDetection: ChangeDetectionStrategy.OnPush,
// Requires explicit fixture.detectChanges() calls
// Makes tests more explicit and reliable
```

**Prefer input()/output() over @Input/@Output:**

```typescript
// ✅ Modern
item = input.required<Item>();
selected = output<Item>();

// ❌ Legacy
@Input() item!: Item;
@Output() selected = new EventEmitter<Item>();
```

### Debugging Tests

Run with detailed output:

```bash
ng test -- --reporter=verbose
```

Run specific test file:

```bash
ng test -- src/app/component.spec.ts
```

Debug in browser:

```bash
ng test -- --watch --browser=chrome
```

### Performance Tips

1. Use `provideHttpClientTesting()` for HTTP tests
2. Mock expensive operations (timers, animations)
3. Use `fakeAsync` for time-dependent tests
4. Clear mocks in `afterEach` when needed
5. Limit use of `fixture.detectChanges()` calls
