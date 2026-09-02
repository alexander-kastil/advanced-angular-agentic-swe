# App Initialization and inject()

## Running code before bootstrap

`provideAppInitializer` registers work that must finish before the first component renders. Angular waits for every returned promise, so a component can assume the data is already there.

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => inject(AppInitService).loadData()),
    provideAppInitializer(() => inject(ConfigService).loadConfig()),
  ],
};
```

`inject()` works inside the initializer callback because Angular runs it in an injection context. There is no `deps` array and no factory function to write.

## Holding the result in a signal

`ConfigService` fetches `assets/config.json` and stores it in a signal, so every consumer stays reactive without a subscription.

```typescript
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private http = inject(HttpClient);
  readonly config = signal<AppConfig>(new AppConfig());

  async loadConfig() {
    this.config.set(await firstValueFrom(this.http.get<AppConfig>('assets/config.json')));
  }
}
```

## inject() instead of a constructor

`inject()` replaces constructor parameter injection everywhere: components, services, guards, resolvers and interceptors. It is a plain field initializer, so subclasses do not have to forward constructor arguments.

```typescript
export class AppInitComponent {
  private configService = inject(ConfigService);
  private demoService = inject(DemoService);

  readonly config = this.configService.config;
  readonly demos = this.demoService.demos;
}
```

`DemoService` itself uses `httpResource()`, so the demo list on this page is a signal that the template reads directly.

```typescript
@Injectable({ providedIn: 'root' })
export class DemoService {
  readonly demosResource = httpResource<DemoItem[]>(() => `${environment.api}demos`, {
    defaultValue: [],
  });

  readonly demos = computed(() =>
    [...this.demosResource.value()].sort((a, b) => a.sortOrder - b.sortOrder)
  );
}
```
