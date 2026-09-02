# Angular 22 Anti-Patterns

The demo renders this table so you can filter it by category. The entries below carry the reasoning.

## Component API

| Avoid | Use |
| --- | --- |
| `@Input()` / `@Output()` decorators | `input()`, `input.required()`, `model()`, `output()` |
| Constructor parameter injection | `inject()` in a field initializer |
| `@HostBinding` / `@HostListener` | the `host: {}` object in the decorator |
| NgModules for feature organization | standalone components plus `loadComponent` / `loadChildren` |

`inject()` is the one that keeps paying: it works in route guards, resolvers, functional interceptors and helper functions, none of which have a constructor.

```typescript
// avoid
export class UserCardComponent {
  @Input() user!: User;
  @Output() selected = new EventEmitter<User>();
  constructor(private router: Router) {}
}

// use
export class UserCardComponent {
  private router = inject(Router);
  readonly user = input.required<User>();
  readonly selected = output<User>();
}
```

## Templates

| Avoid | Use |
| --- | --- |
| `*ngIf` / `*ngFor` / `*ngSwitch` | `@if` / `@for` / `@switch` |
| `[ngClass]` / `[ngStyle]` | `[class.x]` / `[style.x]` |
| `imports: [CommonModule]` | nothing; import individual pipes when you need them |

Control flow lives in the compiler, so there is no directive to import and `track` is enforced rather than optional.

## State and data

| Avoid | Use |
| --- | --- |
| `obs$ \| async` over an HTTP observable | `httpResource()` |
| `toSignal(this.http.get(...))` | `httpResource()` |
| `.subscribe()` inside a component | `httpResource()` or `resource()` |
| `BehaviorSubject` for local state | `signal()` |
| `@ngrx/store`, `@ngrx/effects`, `@ngrx/entity`, `@ngrx/data` | `signalStore()` from `@ngrx/signals` |

```typescript
// avoid
users = toSignal(this.http.get<User[]>('/api/users'), { initialValue: [] });

// use
readonly users = httpResource<User[]>(() => '/api/users');
```

`httpResource` gives you `value()`, `status()`, `isLoading()`, `error()` and `reload()`, and refetches on its own when a signal read inside the URL function changes. `toSignal` gives you none of that.

## Change detection

| Avoid | Use |
| --- | --- |
| `changeDetection: ChangeDetectionStrategy.Default` | nothing; OnPush is the Angular 22 default |
| `changeDetection: ChangeDetectionStrategy.OnPush` written out | delete the line and the import |
| `effect(..., { allowSignalWrites: true })` | `computed()`, or `linkedSignal()` when it must stay writable |

This is the entry that flipped between versions. Writing OnPush explicitly used to be the fix; in Angular 22 it repeats the default and is removed from this repository on purpose.

## Removed in v22

| Avoid | Use |
| --- | --- |
| `provideHttpClient(withFetch())` / `provideHttpClient(withXhr())` | `provideHttpClient()` |
| `reportProgress`, JSONP support | fetch-based request options |
| `TestBed.flushEffects()` | `TestBed.tick()` |
| Karma plus `karma.conf.js` | Vitest via the `@angular/build:unit-test` builder |
| `@angular/animations` route transition triggers | `animate.enter` / `animate.leave` plus view transitions |
| `withIncrementalHydration()`, `CommonEngine`, Express 4 `server.ts` | the current SSR setup in module 10 |

## Migration checklist

- [ ] Replace decorator inputs and outputs with `input()` / `output()`
- [ ] Replace constructor injection with `inject()`
- [ ] Replace `@HostBinding` / `@HostListener` with `host: {}`
- [ ] Replace structural directives with control flow blocks
- [ ] Replace HTTP reads with `httpResource()`
- [ ] Replace `BehaviorSubject` local state with `signal()`
- [ ] Delete every explicit `ChangeDetectionStrategy.OnPush`
- [ ] Delete `CommonModule` imports and `withXhr()` / `withFetch()`

## References

- [Angular best practices](https://angular.dev)
- [Signals](https://angular.dev/guide/signals)
- [httpResource](https://angular.dev/guide/http/http-resource)
- [Control flow](https://angular.dev/guide/templates/control-flow)
