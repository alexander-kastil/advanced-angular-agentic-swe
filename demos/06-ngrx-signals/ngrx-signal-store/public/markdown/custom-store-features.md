## Overview

`signalStoreFeature()` packages state, computed members and methods into a unit you can drop into any store. This demo composes two of them: the shared `withRequestStatus()` and a local `withAttempts()`.

Examine `request-status.feature.ts` under `shared/`, plus `with-attempts.ts` and `sync.store.ts` next to the demo component.

## The Request Status Feature

```typescript
export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | { error: string };

export function withRequestStatus() {
    return signalStoreFeature(
        withState<RequestStatusState>({ requestStatus: 'idle' }),
        withComputed(({ requestStatus }) => ({
            isPending: computed(() => requestStatus() === 'pending'),
            isFulfilled: computed(() => requestStatus() === 'fulfilled'),
            error: computed(() => {
                const status = requestStatus();
                return typeof status === 'object' ? status.error : null;
            }),
        }))
    );
}
```

The state is one discriminated union rather than three booleans, so an impossible combination such as "pending and errored" cannot be represented.

## Pure Updater Functions

A feature exports plain functions that return a state slice. They are tree-shakeable and testable without a store:

```typescript
export function setPending(): RequestStatusState {
    return { requestStatus: 'pending' };
}

export function setFulfilled(): RequestStatusState {
    return { requestStatus: 'fulfilled' };
}

export function setError(error: string): RequestStatusState {
    return { requestStatus: { error } };
}
```

## A Second Feature

`withAttempts()` adds counters and a derived success rate, and shows that a feature may carry methods of its own:

```typescript
export function withAttempts() {
  return signalStoreFeature(
    withState<AttemptsState>({ attempts: 0, failures: 0 }),
    withComputed(({ attempts, failures }) => ({
      successRate: computed(() =>
        attempts() === 0 ? 0 : Math.round(((attempts() - failures()) / attempts()) * 100)
      ),
    })),
    withMethods((store) => ({
      countAttempt() { patchState(store, { attempts: store.attempts() + 1 }); },
      countFailure() { patchState(store, { failures: store.failures() + 1 }); },
      resetAttempts() { patchState(store, { attempts: 0, failures: 0 }); },
    }))
  );
}
```

## Composing Them

```typescript
export const SyncStore = signalStore(
  withRequestStatus(),
  withAttempts(),
  withMethods((store) => ({
    sync: rxMethod<boolean>(
      pipe(
        switchMap((shouldFail) => {
          store.countAttempt();
          patchState(store, setPending());
          return timer(800).pipe(
            switchMap(() => shouldFail ? throwError(() => new Error('Sync rejected by the server')) : of('synchronized')),
            tapResponse({
              next: () => patchState(store, setFulfilled()),
              error: (err: Error) => {
                store.countFailure();
                patchState(store, setError(err.message));
              },
            })
          );
        })
      )
    ),
  }))
);
```

Order matters: a feature only sees what was declared before it, which is why the final `withMethods()` can call `countAttempt()` from `withAttempts()`.

## Where Else It Is Used

`topics.store.ts` and `skills.store.ts` both mount `withRequestStatus()` beside `withEntities()`, which is how one feature ends up driving the progress bar on three different pages.
