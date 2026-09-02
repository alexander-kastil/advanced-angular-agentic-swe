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

## The Union Case

Deep signals thin out at a slice whose type is a union of records, and that is deliberate. Only a key present on every member of the union survives, because the value could be either shape:

```typescript
export type Contact =
    | { kind: 'email'; address: string }
    | { kind: 'phone'; number: string; countryCode: string };

type UserProfileState = {
    user: UserProfile;
    contact: Contact;
    editMode: boolean;
};
```

`DeepSignalOf<Contact>` distributes over the union and resolves to `DeepSignal<{ kind: 'email'; address: string }> | DeepSignal<{ kind: 'phone'; number: string; countryCode: string }>`. `store.contact.kind` therefore still compiles, because `kind` is on both members, while `store.contact.address()` does not, because `address` is only on one. Add a non-record member and that one loses its deep members too: `Contact | null` resolves to `DeepSignal<Email> | DeepSignal<Phone> | Signal<null>`, and even `store.contact.kind` stops compiling.

Narrow on the discriminant instead, either in a computed:

```typescript
contactLabel: computed(() => {
    const contact = store.contact();
    return contact.kind === 'email' ? contact.address : `${contact.countryCode} ${contact.number}`;
}),
```

or in the template:

```html
@switch (store.contact().kind) {
  @case ('email') { <p>{{ store.contactLabel() }}</p> }
  @case ('phone') { <p>{{ store.contactLabel() }}</p> }
}
```

Writing a union slice is a whole replacement, never a partial patch, because there is no shared shape to merge into:

```typescript
usePhone() {
    patchState(store, { contact: { kind: 'phone', number: '660 1234567', countryCode: '+43' } });
},
```

## Key Points

- Deep signals auto-unwrap nested state — `store.user.address.city()` is a signal
- `withComputed` can reference deep signals for derived state
- `patchState` with an updater function preserves immutability for nested updates
- A union-typed slice is read whole and narrowed; it has no deep members