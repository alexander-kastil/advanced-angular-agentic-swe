import { Component, computed, inject, signal } from '@angular/core';
import { getState } from '@ngrx/signals';
import { AuthStore } from '../../../auth/auth.store';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

@Component({
  selector: 'app-auth-store',
  templateUrl: './auth-store.component.html',
  styleUrl: './auth-store.component.scss',
  imports: [CodeBlockComponent]
})
export class AuthStoreComponent {
  readonly auth = inject(AuthStore);

  readonly name = signal('Ada Lovelace');
  readonly lifetime = signal(30);
  readonly lifetimes = [15, 30, 300];

  readonly state = computed(() => {
    const { token, returnUrl } = getState(this.auth);
    return JSON.stringify({ token: token ? `${token.slice(0, 32)}...` : null, returnUrl }, null, 2);
  });

  readonly claims = computed(() => JSON.stringify(this.auth.claims(), null, 2));

  readonly storeSnippet = `export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState({ token: null as string | null, returnUrl: null as string | null, now: Date.now() }),
  withComputed(({ token, now }) => {
    const claims = computed(() => (token() ? decodeJwt(token()!).payload : null));
    const expiresAt = computed(() => Number(claims()?.['exp'] ?? 0) * 1000);
    return {
      claims,
      userName: computed(() => String(claims()?.['name'] ?? '')),
      isAuthenticated: computed(() => expiresAt() > now())
    };
  }),
  withMethods((store) => ({
    login(name: string, lifetimeSeconds = 300) { patchState(store, { token: mint(name, lifetimeSeconds) }); },
    logout() { patchState(store, { token: null }); }
  })),
  withHooks({
    onInit(store) {
      const timer = setInterval(() => store.tick(), 1000);
      return () => clearInterval(timer);
    }
  })
);`;

  setName(value: string): void {
    this.name.set(value);
  }

  setLifetime(value: string): void {
    this.lifetime.set(Number(value));
  }

  login(): void {
    this.auth.login(this.name(), this.lifetime());
  }
}
