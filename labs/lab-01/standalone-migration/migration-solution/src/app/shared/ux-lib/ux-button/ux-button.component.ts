import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'ux-button',
    templateUrl: './ux-button.component.html',
    styleUrls: ['./ux-button.component.scss'],
    standalone: true,
    imports: [MatButton, MatIcon],
})
export class uxButtonComponent {
  @Input() disabled = false;
  @Input() label = '';
  @Input() icon = '';
  @Output() click = new EventEmitter<void>();

  buttonClicked() {
    this.click.emit();
  }
}
