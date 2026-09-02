import { Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-ng-optimized-img',
  templateUrl: './ng-optimized-img.component.html',
  styleUrls: ['./ng-optimized-img.component.scss'],
  imports: [NgOptimizedImage]
})
export class NgOptimizedImgComponent {
  readonly optimized = signal(true);

  readonly gallery = [
    { file: 'ebus.png', width: 800, height: 329, alt: 'Diagram of an event bus' },
    { file: 'interceptor.png', width: 862, height: 244, alt: 'Diagram of an HTTP interceptor chain' },
    { file: 'ngrx.png', width: 593, height: 275, alt: 'Diagram of the NgRx data flow' }
  ];

  toggle() {
    this.optimized.update(value => !value);
  }
}
