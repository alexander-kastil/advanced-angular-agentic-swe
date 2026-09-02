import { Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  template: `
    <div class="progress">
      @if (mode() === 'determinate') {
        <div class="progress-value" [style.width.%]="value()"></div>
      } @else {
        <div class="progress-indeterminate"></div>
      }
    </div>
  `,
})
export class ProgressBarComponent {
  readonly mode = input<'indeterminate' | 'determinate'>('indeterminate');
  readonly value = input(0);
}
