import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.scss'],
})
export class CounterComponent {

  count = signal(0);

  incrementCount() {
    this.count.update((c) => c + 1);
  }
}
