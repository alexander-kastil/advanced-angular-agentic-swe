# Async App Initialization with injectAsync

## The problem

`provideAppInitializer` runs before the first component renders and bootstrap waits for whatever promise it returns. Anything the initializer injects the ordinary way is pulled into the initial bundle, which is the wrong trade when the dependency is large and only needed once.

`injectAsync` breaks that link. It takes a loader that returns a promise for an injectable and hands back a getter:

```typescript
declare function injectAsync<T>(
  loader: () => Promise<ProviderToken<T>>,
  options?: InjectAsyncOptions,
): () => Promise<T>;
```

## Both together

```typescript
provideAppInitializer(async () => {
  const log = inject(StartupLogService);
  const loadFlags = injectAsync(() =>
    import('./demos/samples/app-initializer-async/remote-flags.service').then(
      (m) => m.RemoteFlagsService,
    ),
  );

  log.record('initializer started, requesting the lazy flags service');
  const flags = await loadFlags();
  await flags.load();
  log.record(`flags resolved: ${flags.enabled().join(', ')}`);
});
```

Two details make this correct rather than merely compiling:

- `inject()` and `injectAsync()` are both called synchronously, before the first `await`. The injection context ends at the first suspension point; the getter `injectAsync` returns has already captured the injector, so calling it after an `await` is fine.
- The service must be auto-provided, which means `@Injectable({ providedIn: 'root' })` or `@Service()`. A service that only exists in some `providers` array has no injector for the loader to resolve it in.

The build proves the split: `remote-flags.service` leaves the initial bundle and shows up as its own lazy chunk.

## Prefetching from a component

The second card on this page injects the same service lazily, this time with a prefetch trigger:

```typescript
private loadFlags = injectAsync(
  () => import('./remote-flags.service').then((m) => m.RemoteFlagsService),
  { prefetch: onIdle },
);

async showFlags() {
  const flags = await this.loadFlags();
  this.flags.set(flags.enabled());
}
```

`onIdle` is a `PrefetchTrigger`: a function returning a promise that resolves when the browser is idle. It delegates to the configured `IdleService`, which uses `requestIdleCallback` where available and falls back to `setTimeout`. Pass options through a wrapper when the default timeout is wrong:

```typescript
injectAsync(loader, { prefetch: () => onIdle({ timeout: 100 }) });
```

`provideIdleServiceWith` replaces the idle implementation application-wide, which is how tests get deterministic prefetching.

## Choosing between the two

- Blocking the initializer is right when the app is wrong without the data: runtime configuration, feature flags that decide routing, a locale.
- Prefetching from a component is right when the data only matters once the user reaches a screen. Bootstrap stays fast, and the chunk is usually already there by the time it is asked for.

Never do both for the same dependency without measuring. An initializer that awaits a chunk moves that download onto the critical path, and the whole point of the lazy import was to keep it off.
