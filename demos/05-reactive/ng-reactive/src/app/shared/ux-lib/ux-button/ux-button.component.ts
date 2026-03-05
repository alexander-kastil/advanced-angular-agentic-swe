import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ux-button',
  templateUrl: './ux-button.component.html',
  styleUrls: ['./ux-button.component.scss'],
  imports: [MatButton, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush
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
