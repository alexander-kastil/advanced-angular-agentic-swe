import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-slide-toggle',
  template: `
    <label class="switch">
      <input
        type="checkbox"
        class="sr-only"
        [checked]="checked()"
        [disabled]="disabled()"
        [attr.aria-label]="ariaLabel() || null"
        (change)="toggled.emit(!checked())"
      />
      <span class="switch-track"><span class="switch-thumb"></span></span>
      <ng-content />
    </label>
  `,
})
export class SlideToggleComponent {
  readonly checked = input(false);
  readonly disabled = input(false);
  readonly ariaLabel = input('', { alias: 'aria-label' });
  readonly toggled = output<boolean>();
}
