import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
  host: {
    '[class.pulsing]': 'pulsing()',
  },
})
export class StatusBadgeComponent {
  readonly label = signal('idle');
  readonly pulsing = signal(false);

  pulse(label: string) {
    this.label.set(label);
    this.pulsing.set(true);
    setTimeout(() => this.pulsing.set(false), 800);
  }
}
