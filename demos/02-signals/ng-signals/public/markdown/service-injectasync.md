- Angular 22 adds a dedicated `@Service()` decorator and an `injectAsync()` function. Together they
  make a service **tree-shakable, lazily loadable, and free of the `providedIn` boilerplate**.

## Before

```typescript
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SkillStatsService {
  private http = inject(HttpClient);
}
```

## After

```typescript
import { Service, inject } from '@angular/core';

@Service()
export class SkillStatsService {
  private http = inject(HttpClient);
}
```

- `@Service()` is auto-provided by default: no `providedIn`, no providers array. When you do want to
  provide it yourself, opt out with `@Service({ autoProvided: false })` and list it in a
  `providers` array as usual.
- `@Service({ factory: () => ... })` creates a service whose instance comes from a factory, the
  replacement for `useFactory` on a token you own.

## The migration schematic

Run this from the app folder to convert `@Injectable` to `@Service` where it applies:

```bash
ng generate @angular/core:service-migration
```

`service` is a registered alias, so `ng generate @angular/core:service` does the same thing. The
schematic takes one option, `--path`, defaulting to `./`:

```bash
ng generate @angular/core:service-migration --path=src/app/skills
```

What it actually does, from the schematic source:

| Input | Output |
| --- | --- |
| `@Injectable({ providedIn: 'root' })` | `@Service()` |
| `@Injectable()` | `@Service({ autoProvided: false })` |
| any other `providedIn`, or any extra property | left untouched |
| class with a constructor that takes parameters | left untouched |

The `Injectable` import is dropped from a file only when **every** injectable in that file migrated,
so a partially migrated file keeps both imports. Constructor DI is the usual blocker: run
`ng generate @angular/core:inject-migration` first, then re-run this one.

## Lazy loading with injectAsync

- A service that is auto-provided (`@Service()` or `@Injectable({ providedIn: 'root' })`) can be
  pulled in **on demand**, so its code never lands in the initial bundle:

```typescript
import { injectAsync, onIdle } from '@angular/core';

private readonly stats = injectAsync(
  () => import('./skill-stats.service').then((m) => m.SkillStatsService),
  { prefetch: onIdle },
);

async run() {
  const service = await this.stats();
  this.summary.set(await service.summarize());
}
```

- `injectAsync()` returns a **function returning a promise**, not the instance. Call it where you
  need the service; the module is fetched once and the instance cached afterwards.
- It must be called in an injection context, so a field initializer or the constructor.
- `prefetch: onIdle` starts the download when the browser goes idle, so the first click does not
  pay the network cost. `onIdle({ timeout: 100 })` bounds the wait; `provideIdleServiceWith()`
  replaces the default `requestIdleCallback` strategy.
- The loader may resolve either the class itself or a module with a `default` export.

> Requirement: the lazily injected service **must be auto-provided**. A service listed in a
> component's `providers` array cannot be reached this way, because its provider record has to exist
> before the module loads.
