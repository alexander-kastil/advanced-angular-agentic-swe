import { Component, input } from '@angular/core';

@Component({
  selector: 'app-info-card',
  template: `<div class="card">Info: {{ message() }}</div>`,
  styles: `
    .card {
      border-left: 4px solid #3f51b5;
      padding: 8px 12px;
      margin-bottom: 8px;
    }
  `,
})
export class InfoCardComponent {
  readonly message = input('');
}
