import { Component, inject, input } from '@angular/core';
import { DeferTimeline } from './defer-timeline.service';

@Component({
  selector: 'app-light-panel',
  template: `
    <div class="panel light">
      <strong>{{ label() }}</strong>
      <p>Light payload. No third-party dependency, so its chunk is a few hundred bytes.</p>
    </div>
  `,
  styles: `
    .panel { border-left: 4px solid var(--color-primary); padding: 8px 12px; }
    .panel p { margin: 4px 0 0; color: #55595c; }
  `
})
export class LightPanelComponent {
  private timeline = inject(DeferTimeline);
  readonly label = input.required<string>();

  constructor() {
    queueMicrotask(() => this.timeline.record(this.label(), 'light-panel'));
  }
}
