import { Component, computed, input, model } from '@angular/core';
import { CopyToClipboard } from './copy-to-clipboard';

@Component({
  selector: 'app-masked-value',
  hostDirectives: [{ directive: CopyToClipboard, inputs: ['appCopyToClipboard'] }],
  template: `
    <span class="value" [class.empty]="!value()">{{ display() }}</span>
    <button type="button" [attr.aria-label]="label()" [attr.aria-pressed]="revealed()" (click)="toggle()">
      {{ revealed() ? 'Hide' : 'Reveal' }}
    </button>
  `,
  styles: `
    :host {
      align-items: center;
      cursor: copy;
      display: inline-flex;
      gap: var(--space-md);
    }
    :host([data-copied='true'])::after {
      color: var(--color-accent-text);
      content: 'copied';
      font-size: 0.6875rem;
    }
    .value {
      font-family: ui-monospace, monospace;
      font-size: 0.8125rem;
    }
    .value.empty {
      color: var(--color-muted-foreground);
      font-style: italic;
    }
    button {
      background: none;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      color: var(--color-muted-foreground);
      cursor: pointer;
      font-size: 0.75rem;
      padding: var(--space-xs) var(--space-md);
      transition: color 200ms, border-color 200ms;
    }
    button:hover {
      border-color: var(--color-accent-text);
      color: var(--color-accent-text);
    }
  `,
})
export class MaskedValue {
  readonly value = input<string | null>(null);
  readonly label = input('Reveal value');
  readonly revealed = model(false);

  readonly display = computed(() => {
    const value = this.value();
    if (!value) return 'not set';
    return this.revealed() ? value : '•'.repeat(Math.min(value.length, 24));
  });

  toggle(): void {
    this.revealed.update((revealed) => !revealed);
  }
}
