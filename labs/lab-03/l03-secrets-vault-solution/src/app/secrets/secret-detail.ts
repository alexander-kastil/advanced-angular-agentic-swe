import { Component, computed, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MaskedValue } from '../shared/masked-value';
import { Secret } from './secret';

@Component({
  selector: 'app-secret-detail',
  imports: [MaskedValue],
  template: `
    <h3>{{ secret().name }}</h3>
    <dl>
      <dt>User</dt>
      <dd>{{ secret().user ?? 'not set' }}</dd>
      <dt>Url</dt>
      <dd>{{ secret().url ?? 'not set' }}</dd>
      <dt>Value</dt>
      <dd>
        <app-masked-value [value]="secret().comment" [appCopyToClipboard]="secret().comment"
                          [label]="'Reveal the value of ' + secret().name" />
      </dd>
      <dt>MFA</dt>
      <dd>{{ secret().mfa ? 'yes' : 'no' }}</dd>
      <dt>Version</dt>
      <dd>{{ secret().version }}</dd>
    </dl>

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
    dl {
      display: grid;
      gap: var(--space-md) var(--space-xl);
      grid-template-columns: max-content minmax(0, 1fr);
      margin: 0 0 var(--space-2xl);
    }
    dt {
      color: var(--color-muted-foreground);
      font-size: 0.75rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    dd {
      font-size: 0.875rem;
      margin: 0;
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
      border-color: var(--color-accent);
      color: var(--color-accent);
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

  private readonly history = httpResource<Secret[]>(
    () => `/api/secrets/versions/${encodeURIComponent(this.secret().name)}?listId=${this.secret().listId}`,
  );

  readonly versions = computed(() => this.history.value() ?? []);
}
