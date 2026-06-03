# Angular Anti-Patterns

Patterns that must not appear in Angular v22+ code.

## Dependency Injection

| Wrong | Correct |
|---|---|
| `constructor(private svc: UserService)` | `svc = inject(UserService)` |
| `@Injectable({ providedIn: 'root' })` with constructor DI | Use `inject()` in field initializer |

## Templates

| Wrong | Correct |
|---|---|
| `*ngIf="condition"` | `@if (condition) { }` |
| `*ngFor="let x of list"` | `@for (x of list; track x.id) { }` |
| `*ngSwitch` | `@switch (val) { @case ('x') { } }` |
| `[ngClass]="{ active: flag }"` | `[class.active]="flag()"` |
| `[ngStyle]="{ color: val }"` | `[style.color]="val()"` |
| `@HostBinding` / `@HostListener` | `host: { '[class.x]': '...', '(click)': '...' }` |

## State Management

| Wrong | Correct |
|---|---|
| `BehaviorSubject` for local state | `signal()` |
| `Observable`-only state without signals | Combine with `toSignal()` or use `resource()` |
| `subscribe()` in component body | `toSignal()`, async pipe, or `resource()` |
| `@ngrx/store` class-based reducers | NgRx Signal Store (`withState`, `withMethods`) |

## Architecture

| Wrong | Correct |
|---|---|
| `NgModule` for feature organization | Standalone imports |
| `import CommonModule` | Import specific directives/pipes |
| `standalone: true` in decorator | Omit — standalone is the default in v20+ |
| Default change detection on components | `ChangeDetectionStrategy.OnPush` |

## Data Loading

| Wrong | Correct |
|---|---|
| Manual `http.get()` + `BehaviorSubject` wiring | `httpResource()` or `resource()` |
| `subscribe()` in `ngOnInit` for HTTP | `resource()` with declarative loader |

## Testing

| Wrong | Correct |
|---|---|
| Testing private methods | Test public behavior and outputs |
| Skipping error scenarios | Always test happy path + error + edge cases |
| No service mocking | Mock all external dependencies |
| `jasmine.createSpyObj` | `vi.fn()` (Vitest project uses Vitest APIs) |
