# Angular Advanced - Claude Code Configuration

## Repository Purpose & Structure

This repository contains training materials, demos, and infrastructure for Advanced Angular Development. It is a **teaching repository** - not a production application - designed to demonstrate Angular concepts through hands-on examples.

### Key Directories

- **`demos/`** - Module-organized demonstrations (12 modules, each in a separate folder, e.g., `demos/02-signals/ng-signals`)
- **`labs/`** - Step-by-step lab instructions and scripts for students

Always start applications from their respective project folders, not the repository root.

## Angular Standards

- **Angular Version**: 22.x or later
- **Architecture**: Standalone components (default - do NOT set `standalone: true` explicitly)
- **Change Detection**: OnPush is the v22 default - never write `changeDetection` explicitly
- **Dependency Injection**: Always use `inject()` function - never constructor parameters
- **Testing**: Vitest (native Angular 22 support via `@angular/build`)

## Important Rules

- The AI NEVER commits. Do not stage, commit, or push under any circumstance, and do not mention, offer, or ask anything commit-related. Leave all changes as uncommitted working-tree edits for the user to handle.
- Write clean code. No comments. Do not over-engineer.
- Never use PowerShell for Angular code refactoring - use bash.
- Do not write docs unless asked. If asked, be concise and to the point.
- Use Angular CLI for scaffolding: `ng generate component`, `ng generate service`, etc.
- Run apps from their project subdirectory, not the repo root.

## Component Pattern

```typescript
import { Component, inject, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `
    @if (loading()) {
      <p>Loading...</p>
    } @else {
      @for (item of items(); track item.id) {
        <span>{{ item.name }}</span>
      }
    }
  `,
})
export class ExampleComponent {
  private service = inject(ExampleService);

  items = input.required<Item[]>();
  loading = input(false);
  selected = output<Item>();
}
```

## Anti-Patterns (Never Use)

| Anti-pattern | Modern Replacement |
|---|---|
| `@Input()` / `@Output()` decorators | `input()` / `output()` signals |
| `*ngIf` / `*ngFor` / `*ngSwitch` | `@if` / `@for` / `@switch` |
| Constructor injection | `inject()` function |
| `async` pipe + Observable for HTTP | `httpResource()` |
| `toSignal(http.get(...))` | `httpResource()` |
| `BehaviorSubject` for local state | `signal()` |
| `subscribe()` in components | `toSignal()` or `resource()` |
| `ngClass` / `ngStyle` | `[class.x]` / `[style.x]` |
| `CommonModule` import | Remove - standalone by default |
| `NgModules` for feature organization | Standalone + lazy routes |
| `@HostBinding` / `@HostListener` | `host: {}` object in `@Component` |
| Explicit `changeDetection:` | Omit it - OnPush is the v22 default |

## State Management

```typescript
// Local state
readonly count = signal(0);
readonly doubled = computed(() => this.count() * 2);

// HTTP data
readonly users = httpResource<User[]>('/api/users');

// Complex app state - NgRx Signal Store
// withState, withComputed, withMethods
```

## Testing Pattern (Vitest)

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('MyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [
        { provide: MyService, useValue: { getData: vi.fn() } }
      ]
    }).compileComponents();
  });

  it('sets signal input and detects changes', () => {
    const fixture = TestBed.createComponent(MyComponent);
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('expected');
  });
});
```

## Demo Module Structure

Each demo app follows this pattern:
- `db.json` - Demo catalog with url, title, teaches, topic, sortOrder, md fields
- `demo.routes.ts` - Route definitions
- `public/markdown/<name>.md` - Markdown guide for each demo
- `src/app/demos/samples/<name>/` - Component implementation

## Workflows

See memory files for detailed workflow patterns:
- `memory/angular-patterns.md` - Detailed Angular v22+ patterns
- `memory/testing-patterns.md` - Vitest testing patterns
- `memory/workflows.md` - Common task workflows (ng-update, check-demos, describe-module)
