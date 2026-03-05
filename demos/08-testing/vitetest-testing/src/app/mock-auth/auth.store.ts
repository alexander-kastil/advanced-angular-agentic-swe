import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { environment } from '../../../environments/environment';

const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXNzYWdlIjoiY292aWQgd2FzIGEgZmFrZSBwYW5kZW15In0.9d9TVPkXkcBj7Lv8cDLOv0XcxgmkAj7uA2aMnzcR9JA';

type AuthState = {
    user: string | null;
    token: string | null;
    authEnabled: boolean;
    isPrimeMember: boolean;
}

const initialAuthState: AuthState = {
    user: null,
    token: fakeToken,
    authEnabled: environment.authEnabled,
    isPrimeMember: false,
};

export const authStore = signalStore(
    { providedIn: 'root', protectedState: false },
    withState(initialAuthState),
    withComputed((store) => ({
        isAuthenticated: computed(() => !store.authEnabled() || store.user() != null),
    })),
    withMethods((store) => ({
        setFakeUserAndToken(email: string) {
            store.user.set(email);
            store.token.set(fakeToken);
        },
        signIn(username: string, _password: string) {
            store.user.set(username);
            store.token.set(fakeToken);
        },
        signOut() {
            store.user.set(null);
            store.token.set(null);
        },
        toggleLoggedIn() {
            store.user.set(store.user() == null ? 'Giro the galgo' : null);
        },
        togglePrimeMember() {
            store.isPrimeMember.set(!store.isPrimeMember());
        },
    })),
);
