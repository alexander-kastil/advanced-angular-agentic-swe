import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-status-page',
  imports: [RouterLink],
  template: `
    <main>
      <h1>Vault status</h1>
      <p class="state" [class.up]="isUp()">{{ health() }}</p>
      <a routerLink="/login">Sign in</a>
    </main>
  `,
  styles: `
    main {
      margin: 0 auto;
      max-width: 480px;
      padding: var(--space-3xl);
    }
    h1 {
      font-size: 1.25rem;
      margin-bottom: var(--space-xl);
    }
    .state {
      color: var(--color-muted-foreground);
      font-family: ui-monospace, monospace;
    }
    .state.up {
      color: var(--color-accent-text);
    }
    a {
      color: var(--color-accent-text);
      display: inline-block;
      margin-top: var(--space-2xl);
    }
  `,
})
export class StatusPage {
  readonly health = input.required<string>();
  readonly isUp = computed(() => this.health() === 'Healthy');
}
