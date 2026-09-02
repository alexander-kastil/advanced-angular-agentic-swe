import { Component, effect, EffectRef, inject, Injector, signal } from '@angular/core';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';

@Component({
  selector: 'app-effect-cleanup',
  imports: [BoxedDirective],
  template: `
    <div boxed>
      <div>
        <p>Interval running: {{ running() }}</p>
        <p>Ticks: {{ ticks() }}</p>
        <p>Cleanup runs: {{ cleanupRuns() }}</p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button type="button" class="btn btn-primary" (click)="toggle()">
          {{ running() ? 'Stop' : 'Start' }} Interval
        </button>
      </div>
    </div>

    <div boxed>
      <div>
        <p>One-shot log: {{ initLog() }}</p>
        <p>Watched value: {{ watched() }}</p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button type="button" class="btn btn-primary" (click)="bump()">
          Change Watched Value
        </button>
        <button type="button" class="btn btn-primary" (click)="armOnce()">
          Arm One-Shot Effect
        </button>
      </div>
    </div>
  `,
})
export class EffectCleanupComponent {
  private injector = inject(Injector);

  readonly running = signal(false);
  readonly ticks = signal(0);
  readonly cleanupRuns = signal(0);

  readonly watched = signal(0);
  readonly initLog = signal('not armed');

  private onceRef: EffectRef | null = null;

  constructor() {
    effect((onCleanup) => {
      if (!this.running()) {
        return;
      }
      const handle = setInterval(() => this.ticks.update((t) => t + 1), 500);
      onCleanup(() => {
        clearInterval(handle);
        this.cleanupRuns.update((c) => c + 1);
      });
    });
  }

  toggle() {
    this.running.update((r) => !r);
  }

  bump() {
    this.watched.update((v) => v + 1);
  }

  armOnce() {
    this.onceRef?.destroy();
    this.initLog.set('armed, waiting for first run');
    this.onceRef = effect(
      () => {
        const value = this.watched();
        this.initLog.set(`ran once with value ${value}`);
        this.onceRef?.destroy();
        this.onceRef = null;
      },
      { injector: this.injector },
    );
  }
}
