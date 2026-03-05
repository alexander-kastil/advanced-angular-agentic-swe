SignalStore exposes nested state properties as individual signals. This means you can read `store.user.address.city()` instead of `store.user().address.city` — each level is its own signal providing fine-grained reactivity.

## User Profile Store

Examine `user-profile.store.ts`. The state contains a nested `address` object:

```typescript
type UserProfileState = {
    user: UserProfile;
    editMode: boolean;
};

export const UserProfileStore = signalStore(
    withState(initialState),
    withComputed((store) => ({
        fullAddress: computed(() => {
            const addr = store.user.address;
            return `${addr.street()}, ${addr.zip()} ${addr.city()}`;
        }),
    })),
    withMethods((store) => ({
        updateCity(city: string) {
            patchState(store, (state) => ({
                user: {
                    ...state.user,
                    address: { ...state.user.address, city },
                },
            }));
        },
    }))
);
```

## Deep Signal Access in Templates

Access nested properties directly — no intermediate `()` calls needed:

```html
<p>{{ store.user.name() }}</p>
<p>{{ store.user.address.city() }}</p>
<p>{{ store.fullAddress() }}</p>
```

## Key Points

- Deep signals auto-unwrap nested state — `store.user.address.city()` is a signal
- `withComputed` can reference deep signals for derived state
- `patchState` with an updater function preserves immutability for nested updates