import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

type Address = {
    street: string;
    city: string;
    zip: string;
};

export type Contact =
    | { kind: 'email'; address: string }
    | { kind: 'phone'; number: string; countryCode: string };

type UserProfile = {
    name: string;
    email: string;
    address: Address;
};

type UserProfileState = {
    user: UserProfile;
    contact: Contact;
    editMode: boolean;
};

const initialState: UserProfileState = {
    user: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        address: {
            street: 'Am Himmel 18',
            city: 'Vienna',
            zip: '1190',
        },
    },
    contact: { kind: 'email', address: 'jane@example.com' },
    editMode: false,
};

export const UserProfileStore = signalStore(
    withState(initialState),
    withComputed((store) => ({
        fullAddress: computed(() => {
            const addr = store.user.address;
            return `${addr.street()}, ${addr.zip()} ${addr.city()}`;
        }),
        contactLabel: computed(() => {
            const contact = store.contact();
            return contact.kind === 'email' ? contact.address : `${contact.countryCode} ${contact.number}`;
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
        updateZip(zip: string) {
            patchState(store, (state) => ({
                user: {
                    ...state.user,
                    address: { ...state.user.address, zip },
                },
            }));
        },
        useEmail() {
            patchState(store, (state) => ({ contact: { kind: 'email' as const, address: state.user.email } }));
        },
        usePhone() {
            patchState(store, { contact: { kind: 'phone', number: '660 1234567', countryCode: '+43' } });
        },
        toggleEditMode() {
            patchState(store, (state) => ({ editMode: !state.editMode }));
        },
    }))
);
