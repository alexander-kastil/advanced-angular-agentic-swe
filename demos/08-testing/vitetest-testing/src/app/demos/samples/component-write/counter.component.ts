import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-component-events',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component-events.component.html',
  styleUrls: ['./component-events.component.scss'],
  imports: [
    MatCardModule,
    MatButtonModule,
  ]
})
export class ComponentEventsComponent {

  count = signal(0);

  incrementCount() {
    this.count.update((c) => c + 1);
  }
}
