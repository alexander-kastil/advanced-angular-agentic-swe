import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, required, submit } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';
import { AuthStore } from '../auth/auth-store';

@Component({
  selector: 'app-login-page',
  imports: [FormField],
  template: `
    <main>
      <h1>Secrets and Document Vault</h1>
      <form (submit)="$event.preventDefault(); signIn()">
        <label>
          <span>User</span>
          <input [formField]="loginForm.name" autocomplete="username" />
        </label>
        <label>
          <span>Password</span>
          <input type="password" [formField]="loginForm.password" autocomplete="current-password" />
        </label>
        <button type="submit" [disabled]="!loginForm().valid()">Sign in</button>
        @if (failure()) {
          <em role="alert">{{ failure() }}</em>
        }
      </form>
    </main>
  `,
  styles: `
    :host {
      align-items: center;
      display: flex;
      justify-content: center;
      min-height: 100dvh;
    }
    main {
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      padding: var(--space-3xl);
      width: min(360px, 90vw);
    }
    h1 {
      font-size: 1.125rem;
      margin-bottom: var(--space-2xl);
    }
    form {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }
    label {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }
    span {
      color: var(--color-muted-foreground);
      font-size: 0.75rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    input {
      background: var(--color-muted);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      color: var(--color-foreground);
      font: inherit;
      padding: var(--space-md) var(--space-lg);
    }
    button {
      background: var(--color-accent);
      border: none;
      border-radius: var(--radius);
      color: var(--color-on-accent);
      cursor: pointer;
      font: inherit;
      font-weight: 600;
      padding: var(--space-lg);
    }
    button:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }
    em {
      color: var(--color-destructive);
      font-size: 0.8125rem;
      font-style: normal;
    }
  `,
})
export class LoginPage {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  readonly failure = signal<string | null>(null);
  readonly model = signal({ name: '', password: '' });

  readonly loginForm = form(this.model, (path) => {
    required(path.name);
    required(path.password);
  });

  async signIn(): Promise<void> {
    this.failure.set(null);
    await submit(this.loginForm, async (field) => {
      const { name, password } = field().value();
      try {
        await this.auth.signIn(name, password);
        const next = new URLSearchParams(location.search).get('next') ?? '/secrets';
        await this.router.navigateByUrl(next);
      } catch {
        this.failure.set('That user name and password were not accepted.');
      }
      return undefined;
    });
  }
}
