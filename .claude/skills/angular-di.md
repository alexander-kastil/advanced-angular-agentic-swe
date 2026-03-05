# Angular Dependency Injection (v21+)

## inject() - Always Use This

```typescript
export class UserList {
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private analytics = inject(Analytics, { optional: true }); // nullable
}
```

## Injectable Service

```typescript
@Injectable({ providedIn: 'root' }) // singleton
export class UserService {
  private http = inject(HttpClient);
  private _users = signal<User[]>([]);
  readonly users = this._users.asReadonly();

  async load() {
    const users = await firstValueFrom(this.http.get<User[]>('/api/users'));
    this._users.set(users);
  }
}
```

## Provider Scopes

```typescript
// Root (singleton)
@Injectable({ providedIn: 'root' })

// Component (new instance per component)
@Component({ providers: [EditorState] })

// Route (shared within route tree)
{ path: 'admin', providers: [AdminService], children: [...] }
```

## Injection Tokens

```typescript
export const API_URL = new InjectionToken<string>('API_URL');
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
export const WINDOW = new InjectionToken<Window>('Window', {
  providedIn: 'root',
  factory: () => window,
});

// Provide
providers: [
  { provide: API_URL, useValue: 'https://api.example.com' },
  { provide: APP_CONFIG, useValue: { apiUrl: '...', features: { darkMode: true } } },
]

// Inject
private apiUrl = inject(API_URL);
private config = inject(APP_CONFIG);
```

## Provider Types

```typescript
{ provide: Logger, useClass: ConsoleLogger }
{ provide: Logger, useClass: env.production ? ProdLogger : ConsoleLogger }
{ provide: API_URL, useValue: 'https://api.example.com' }
{ provide: AbstractLogger, useExisting: ConsoleLogger }
{
  provide: UserService,
  useFactory: (http: HttpClient, config: AppConfig) => new UserService(http, config.apiUrl),
  deps: [HttpClient, APP_CONFIG],
}
```

## Multi Providers

```typescript
export const VALIDATORS = new InjectionToken<Validator[]>('Validators');

providers: [
  { provide: VALIDATORS, useClass: RequiredValidator, multi: true },
  { provide: VALIDATORS, useClass: EmailValidator, multi: true },
]

// Inject as Validator[]
private validators = inject(VALIDATORS);
```

## App Initializer

```typescript
providers: [
  ConfigService,
  provideAppInitializer(() => inject(ConfigService).loadConfig()),
  provideAppInitializer(() => inject(AuthService).checkSession()),
]
```

## Injection Options

```typescript
inject(Service, { optional: true })  // null if not provided
inject(Service, { self: true })      // only this component's injector
inject(Service, { skipSelf: true })  // skip this, look in parent
inject(Service, { host: true })      // up to host component only
```

## runInInjectionContext

```typescript
private injector = inject(EnvironmentInjector);

executeWithDI<T>(fn: () => T): T {
  return runInInjectionContext(this.injector, fn);
}
```
