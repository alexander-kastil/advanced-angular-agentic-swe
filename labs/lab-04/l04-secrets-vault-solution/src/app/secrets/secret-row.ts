import { Component, input, output } from '@angular/core';
import { MaskedValue } from '../shared/masked-value';
import { Secret } from './secret';

@Component({
  selector: 'app-secret-row',
  imports: [MaskedValue],
  template: `
    <button type="button" class="open" (click)="opened.emit(secret())">
      <span class="name">{{ secret().name }}</span>
      <span class="user">{{ secret().user ?? 'no user' }}</span>
    </button>

    <app-masked-value [value]="secret().comment" [appCopyToClipboard]="secret().comment"
                      [label]="'Reveal the value of ' + secret().name" />

    <span class="actions">
      <ng-content select="[slot=actions]" />
    </span>
  `,
  styles: `
    :host {
      align-items: center;
      border-bottom: 1px solid var(--color-border);
      display: grid;
      gap: var(--space-lg);
      grid-template-columns: minmax(0, 1fr) auto auto;
      padding: var(--space-lg) 0;
    }
    .open {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      font: inherit;
      gap: var(--space-xs);
      padding: 0;
      text-align: left;
    }
    .open:hover .name {
      color: var(--color-accent);
    }
    .name {
      font-weight: 600;
    }
    .user {
      color: var(--color-muted-foreground);
      font-size: 0.75rem;
    }
    .actions {
      align-items: center;
      display: inline-flex;
      gap: var(--space-md);
    }
  `,
})
export class SecretRow {
  readonly secret = input.required<Secret>();
  readonly opened = output<Secret>();
}
