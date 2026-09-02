import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ClockComponent } from './clock/clock.component';
import { ExpanderComponent } from './expander-content/expander.component';
import { ExpanderTemplateComponent } from './expander-template/expander-template.component';

@Component({
  selector: 'app-template-vs-container',
  templateUrl: './template-vs-container.component.html',
  styleUrls: ['./template-vs-container.component.scss'],
  imports: [ExpanderComponent, ClockComponent, ExpanderTemplateComponent],
})
export class TemplateVsContainerComponent {
  readonly currentTime = signal(new Date().toTimeString());

  constructor() {
    const handle = setInterval(() => this.currentTime.set(new Date().toTimeString()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(handle));
  }
}
