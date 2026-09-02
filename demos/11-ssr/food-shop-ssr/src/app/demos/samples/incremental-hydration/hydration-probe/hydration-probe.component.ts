import { afterNextRender, Component, inject, input, signal } from '@angular/core';
import { HydrationLogService } from '../hydration-log.service';

@Component({
  selector: 'app-hydration-probe',
  template: `
    <div class="probe">
      <h4>{{ label() }}</h4>
      <p>{{ blurb() }}</p>
      <button type="button" (click)="bump()">counted {{ clicks() }}</button>
    </div>
  `,
  styles: `
    .probe {
      padding: 0.85rem;
      border: 1px solid #cfd3e6;
      border-radius: 8px;
      background: #fbfbff;
    }

    h4 {
      margin: 0 0 0.25rem;
      font-size: 0.88rem;
    }

    p {
      margin: 0 0 0.6rem;
      font-size: 0.8rem;
      color: #555;
    }

    button {
      padding: 0.35rem 0.75rem;
      border: 1px solid #8a7fd0;
      border-radius: 999px;
      background: #efeaff;
      cursor: pointer;
      font-size: 0.78rem;
    }
  `,
})
export class HydrationProbeComponent {
  private readonly log = inject(HydrationLogService);

  readonly label = input.required<string>();
  readonly blurb = input('');
  readonly clicks = signal(0);

  constructor() {
    afterNextRender(() => this.log.mark(this.label()));
  }

  bump() {
    this.clicks.update((count) => count + 1);
  }
}
