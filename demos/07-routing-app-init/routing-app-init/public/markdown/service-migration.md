# The @Service Decorator and the Service Migration

## What replaces @Injectable

Angular 22 adds `@Service` to `@angular/core`. It is a service declaration with a smaller surface than `@Injectable`, and it is auto-provided by default:

```typescript
import { Service, signal } from '@angular/core';

@Service()
export class AppWideNotesService {
  private readonly items = signal<string[]>([]);
}
```

That is equivalent to `@Injectable({ providedIn: 'root' })`. There is no `providedIn` option to set: the decorator takes `autoProvided` and `factory` and nothing else.

| Old | New |
| --- | --- |
| `@Injectable({ providedIn: 'root' })` | `@Service()` |
| `@Injectable()` plus an entry in a `providers` array | `@Service({ autoProvided: false })` plus the same entry |
| `{ provide: Token, useFactory: () => ... }` | `@Service({ factory: () => ... })` |

## Scoping a service to one route

`autoProvided: false` keeps the class out of the root injector. Something else has to provide it, and a route is a good owner: the route injector is created when the route activates and destroyed when it deactivates.

```typescript
@Service({ autoProvided: false })
export class RouteScopedNotesService { }
```

```typescript
{
  path: 'service-migration',
  component: ServiceMigrationComponent,
  providers: [RouteScopedNotesService],
},
```

The component injects both services identically:

```typescript
readonly appWide = inject(AppWideNotesService);
readonly routeScoped = inject(RouteScopedNotesService);
```

Leave the route and come back: the root instance keeps its identity and its notes, the route-scoped one is a fresh instance with empty state.

That last part is not free. By default the router creates one `EnvironmentInjector` per `Route` config and keeps it for as long as the config is loaded, so deactivating the route does *not* destroy the services in it. Angular 22 adds an opt-in that changes this, and `app.config.ts` enables it:

```typescript
provideRouter(appRoutes, withExperimentalAutoCleanupInjectors()),
```

With it on, the router destroys the `EnvironmentInjector` of any route that is no longer active and is not held by the `RouteReuseStrategy`. The default strategy's `shouldDestroyInjector` returns `true`, so no further configuration is needed; a custom strategy that stores detached handles has to implement `retrieveStoredRouteHandles` so injectors it will reattach are not destroyed. Comment the feature out and the demo's route-scoped counter stops resetting, which is the clearest way to see what it does.

Two rules worth remembering:

- A service used by `injectAsync` must be auto-provided. `@Service()` qualifies; `@Service({ autoProvided: false })` does not, because the loader has no injector to register it in.
- Route-scoped providers are inherited by child routes, so a child can inject the parent route's instance without providing it again.

## The migration schematic

Angular 22.1 ships a schematic that converts eligible `@Injectable` classes to `@Service`. Run it from the application folder:

```
ng generate @angular/core:service-migration
```

It prompts for a path and defaults to `./`. Scope it to a folder to migrate in slices:

```
ng generate @angular/core:service-migration --path=src/app/demos
```

The schematic is registered under the alias `service`, so `ng generate @angular/core:service` runs the same migration.

What it converts, taken from the schematic's own analysis:

- `@Injectable({ providedIn: 'root' })` becomes `@Service()`.
- `@Injectable()` with no arguments becomes `@Service({ autoProvided: false })`, because such a class was already provided by hand somewhere.
- `Injectable` is dropped from the file's `@angular/core` import once every injectable in that file has been converted.

What it declines to touch:

- A class that still uses constructor injection. Run `ng generate @angular/core:inject-migration` first, then re-run this one.
- Any `providedIn` value other than `'root'`, including `'platform'` and `'any'`: `@Service` has no equivalent.
- A decorator argument carrying any property besides `providedIn`, such as `useFactory` or `deps`.

Review the diff before committing. The migration is mechanical, and the interesting cases are the ones it declines to change.
