import { Component, input } from '@angular/core';

@Component({
  selector: 'app-warning-card',
  template: `<div class="card">Warning: {{ message() }}</div>`,
  styles: `
    .card {
      border-left: 4px solid #c62828;
      padding: 8px 12px;
      margin-bottom: 8px;
    }
  `,
})
export class WarningCardComponent {
  readonly message = input('');
}
