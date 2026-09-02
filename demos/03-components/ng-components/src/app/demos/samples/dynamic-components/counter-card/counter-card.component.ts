import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-counter-card',
  template: `
    <div class="card">
      <strong>{{ label() }}</strong>
      <span class="count">{{ count() }}</span>
      <button type="button" (click)="count.set(count() + 1)">+1</button>
      <button type="button" (click)="reset.emit(count())">reset</button>
    </div>
  `,
  styles: `
    .card {
      display: flex;
      align-items: center;
      gap: 8px;
      border-left: 4px solid #00695c;
      padding: 8px 12px;
      margin-bottom: 8px;
    }
    .count {
      font-family: monospace;
      min-width: 2ch;
    }
  `,
})
export class CounterCardComponent {
  readonly label = input('counter');
  readonly count = model(0);
  readonly reset = output<number>();
}
