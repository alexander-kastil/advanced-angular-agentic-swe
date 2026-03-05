SignalStore can be extended with custom features using `signalStoreFeature`. Examine `request-status.feature.ts` which provides reusable request status tracking used by `topics.store.ts`.

## Request Status Feature

The feature encapsulates a common pattern — tracking whether an async operation is idle, pending, fulfilled, or errored:

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

## Pure Updater Functions

State is modified using pure functions to enable tree-shaking:

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

## Usage in Topics Store

```typescript
export const topicsStore = signalStore(
    withEntities<Topic>(),
    withRequestStatus(),
    withMethods((store, service = inject(TopicsService)) => ({
        fetchTopics: rxMethod<void>(
            pipe(
                switchMap(() => {
                    patchState(store, setPending());
                    return service.getTopics().pipe(
                        tapResponse({
                            next: (topics) => patchState(store, setEntities(topics)),
                            error: logError,
                            finalize: () => patchState(store, setFulfilled()),
                        })
                    );
                })
            )),
    })),
);
```