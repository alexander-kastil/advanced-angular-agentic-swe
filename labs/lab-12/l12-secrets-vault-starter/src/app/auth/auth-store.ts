import { computed, inject, PLATFORM_ID, Service, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Session {
  token: string;
  name: string;
  roles: string[];
}

const STORAGE_KEY = 'secrets-vault-session';

@Service()
export class AuthStore {
  private readonly http = inject(HttpClient);
  private readonly session = signal<Session | null>(null);
  // localStorage does not exist while the server renders, and restore() runs there too.
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly user = computed(() => this.session()?.name ?? null);
  readonly roles = computed(() => this.session()?.roles ?? []);
  readonly isSignedIn = computed(() => this.session() !== null);

  token(): string | null {
    return this.session()?.token ?? null;
  }

  restore(): void {
    if (!this.isBrowser) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) this.session.set(JSON.parse(raw) as Session);
  }

  async signIn(name: string, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<{ token: string; name: string; roles: string[] }>('/api/auth/login', {
        name,
        password,
      }),
    );
    const session: Session = { token: response.token, name: response.name, roles: response.roles };
    if (this.isBrowser) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.session.set(session);
  }

  signOut(): void {
    if (this.isBrowser) localStorage.removeItem(STORAGE_KEY);
    this.session.set(null);
  }
}
