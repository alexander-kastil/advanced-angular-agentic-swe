import { Component, computed, inject, input, output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { retryWithBackoff } from '../vault/retry-with-backoff';
import { Category } from './category';
import { SecretForm } from './secret-form';
import { Secret } from './secret';

@Component({
  selector: 'app-secret-detail',
  imports: [SecretForm],
  template: `
    <h3>{{ secret().name }}</h3>

    <app-secret-form [secret]="secret()" [categories]="categories()" (saved)="saved.emit($event)" />

    <p class="version">Version {{ secret().version }}, last changed {{ secret().lastChanged }}</p>

    @defer (on interaction(historyTrigger)) {
      <ul class="versions">
        @for (version of versions(); track version.version) {
          <li>v{{ version.version }} changed {{ version.lastChanged }}</li>
        } @empty {
          <li>No earlier version.</li>
        }
      </ul>
    } @placeholder {
      <button type="button" #historyTrigger class="history">Show version history</button>
    } @loading {
      <p class="state">Loading history</p>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    h3 {
      font-size: 1rem;
      margin-bottom: var(--space-xl);
    }
    .version {
      color: var(--color-muted-foreground);
      font-size: 0.75rem;
      margin: var(--space-2xl) 0 var(--space-lg);
    }
    .history {
      background: none;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      color: var(--color-muted-foreground);
      cursor: pointer;
      font: inherit;
      font-size: 0.8125rem;
      padding: var(--space-md) var(--space-lg);
    }
    .history:hover {
      border-color: var(--color-accent-text);
      color: var(--color-accent-text);
    }
    .versions {
      color: var(--color-muted-foreground);
      font-size: 0.8125rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .state {
      color: var(--color-muted-foreground);
    }
  `,
})
export class SecretDetail {
  readonly secret = input.required<Secret>();
  readonly categories = input.required<Category[]>();
  readonly saved = output<Secret>();

  private readonly http = inject(HttpClient);

  private readonly history = rxResource({
    params: () => ({ name: this.secret().name, listId: this.secret().listId }),
    stream: ({ params }) =>
      this.http
        .get<Secret[]>(
          `/api/secrets/versions/${encodeURIComponent(params.name)}?listId=${params.listId}`,
        )
        .pipe(retryWithBackoff(3)),
  });

  readonly versions = computed(() => this.history.value() ?? []);
}
