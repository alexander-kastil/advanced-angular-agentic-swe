import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { decodeJwt, mintUnsignedJwt } from './jwt';

export const DEMO_ISSUER = 'https://idp.ng-oauth.demo';
export const DEMO_AUDIENCE = 'api://ng-oauth';

interface AuthState {
  token: string | null;
  returnUrl: string | null;
  now: number;
}

const initialState: AuthState = {
  token: null,
  returnUrl: null,
  now: Date.now()
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ token, now }) => {
    const claims = computed(() => {
      const value = token();
      return value ? decodeJwt(value).payload : null;
    });
    const expiresAt = computed(() => {
      const exp = claims()?.['exp'];
      return typeof exp === 'number' ? exp * 1000 : 0;
    });
    return {
      claims,
      expiresAt,
      userName: computed(() => String(claims()?.['name'] ?? '')),
      secondsLeft: computed(() => Math.max(0, Math.round((expiresAt() - now()) / 1000))),
      isAuthenticated: computed(() => expiresAt() > now())
    };
  }),
  withMethods((store) => ({
    login(name: string, lifetimeSeconds = 300): void {
      const issuedAt = Math.floor(Date.now() / 1000);
      const token = mintUnsignedJwt({
        iss: DEMO_ISSUER,
        aud: DEMO_AUDIENCE,
        sub: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        scp: 'access_as_user',
        iat: issuedAt,
        exp: issuedAt + lifetimeSeconds
      });
      patchState(store, { token, now: Date.now() });
    },
    logout(): void {
      patchState(store, { token: null });
    },
    rememberReturnUrl(url: string): void {
      patchState(store, { returnUrl: url });
    },
    takeReturnUrl(): string | null {
      const url = store.returnUrl();
      patchState(store, { returnUrl: null });
      return url;
    },
    tick(): void {
      patchState(store, { now: Date.now() });
    }
  })),
  withHooks({
    onInit(store) {
      const timer = setInterval(() => store.tick(), 1000);
      return () => clearInterval(timer);
    }
  })
);
