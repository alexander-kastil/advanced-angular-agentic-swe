import { computed, inject, Service, signal } from '@angular/core';
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

  readonly user = computed(() => this.session()?.name ?? null);
  readonly roles = computed(() => this.session()?.roles ?? []);
  readonly isSignedIn = computed(() => this.session() !== null);

  token(): string | null {
    return this.session()?.token ?? null;
  }

  restore(): void {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.session.set(session);
  }

  signOut(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.session.set(null);
  }
}
