import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.scss'],
    imports: [
        MatCardModule,
        MatButtonModule,
    ]
})
export class CounterComponent {

  count = signal(0);

  incrementCount() {
    this.count.update((c) => c + 1);
  }
}
