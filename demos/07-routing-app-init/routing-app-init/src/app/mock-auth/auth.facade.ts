import { Injectable, computed, signal } from '@angular/core';

export const fakeToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXNzYWdlIjoiY292aWQgd2FzIGEgZmFrZSBwYW5kZW15In0.9d9TVPkXkcBj7Lv8cDLOv0XcxgmkAj7uA2aMnzcR9JA';

export interface AuthState {
  user: string | null;
  token: string | null;
  isPrimeMember: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly state = signal<AuthState>({
    user: null,
    token: null,
    isPrimeMember: false,
  });

  readonly user = computed(() => this.state().user);
  readonly token = computed(() => this.state().token);
  readonly isAuthenticated = computed(() => this.state().user !== null);
  readonly isPrimeMember = computed(() => this.state().isPrimeMember);
  readonly authResult = computed(() => ({
    user: this.state().user,
    token: this.state().token,
  }));

  setFakeUserAndToken(email: string) {
    this.state.update((state) => ({ ...state, user: email, token: fakeToken }));
  }

  signOut() {
    this.state.update((state) => ({ ...state, user: null, token: null }));
  }

  toggleLoggedIn() {
    this.state.update((state) =>
      state.user === null
        ? { ...state, user: 'Giro the galgo', token: fakeToken }
        : { ...state, user: null, token: null }
    );
  }

  togglePrimeMember() {
    this.state.update((state) => ({
      ...state,
      isPrimeMember: !state.isPrimeMember,
    }));
  }
}
