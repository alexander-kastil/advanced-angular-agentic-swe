import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-expander',
  templateUrl: './expander.component.html',
  styleUrls: ['./expander.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpanderComponent {
  expanded = signal(false);
  readonly title = input('');

  toggleExpander() {
    this.expanded.update(v => !v);
  }
}
