import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

type Address = {
    street: string;
    city: string;
    zip: string;
};

type UserProfile = {
    name: string;
    email: string;
    address: Address;
};

type UserProfileState = {
    user: UserProfile;
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
    editMode: false,
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
        updateZip(zip: string) {
            patchState(store, (state) => ({
                user: {
                    ...state.user,
                    address: { ...state.user.address, zip },
                },
            }));
        },
        toggleEditMode() {
            patchState(store, (state) => ({ editMode: !state.editMode }));
        },
    }))
);
