import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ux-button',
  templateUrl: './ux-button.component.html',
  styleUrls: ['./ux-button.component.scss'],
})
export class uxButtonComponent {
  disabled = input<boolean>(false);
  label = input<string>('');
  icon = input<string>('');
  onClick = output<void>();

  buttonClicked() {
    this.onClick.emit();
  }
}
