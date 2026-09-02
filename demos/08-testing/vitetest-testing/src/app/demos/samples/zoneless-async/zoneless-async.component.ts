import { Component, PendingTasks, computed, effect, inject, signal } from '@angular/core';

export type LoadStatus = 'idle' | 'loading' | 'loaded';

@Component({
  selector: 'app-zoneless-async',
  template: `
    <div class="grid">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Awaited work</h2>
        </div>
        <div class="card-content">
          <p>
            The load runs inside <code>PendingTasks.run()</code>, so the application counts as unstable
            until it settles and <code>fixture.whenStable()</code> waits for exactly that.
          </p>
          <div data-testid="status">status: {{ status() }}</div>
          @for (row of rows(); track row) {
            <div data-testid="row">{{ row }}</div>
          }
          <div data-testid="history">history: {{ history().join(' -> ') }}</div>
        </div>
        <div class="card-actions">
          <button type="button" class="btn btn-primary" data-testid="load" (click)="load()">Load</button>
          <button type="button" class="btn btn-outline" data-testid="reset" (click)="reset()">Reset</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Timer driven state</h2>
        </div>
        <div class="card-content">
          <p>
            The ticker runs on <code>setInterval</code>. A spec replaces it with Vitest fake timers and
            drives the clock by hand, then flushes rendering with <code>TestBed.tick()</code>.
          </p>
          <div data-testid="ticks">{{ ticks() }} ticks</div>
          <div data-testid="elapsed">{{ elapsed() }}</div>
        </div>
        <div class="card-actions">
          <button type="button" class="btn btn-primary" data-testid="start" (click)="startTicking()">Start</button>
          <button type="button" class="btn btn-outline" data-testid="stop" (click)="stopTicking()">Stop</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; }
    .grid .card { max-width: 30rem; margin-top: 0; }
  `],
})
export class ZonelessAsyncComponent {
  private readonly pendingTasks = inject(PendingTasks);
  private timer: ReturnType<typeof setInterval> | undefined;

  readonly status = signal<LoadStatus>('idle');
  readonly rows = signal<string[]>([]);
  readonly ticks = signal(0);
  readonly history = signal<LoadStatus[]>([]);

  readonly elapsed = computed(() => `${this.ticks()} seconds of simulated time`);

  constructor() {
    effect(() => {
      const current = this.status();
      this.history.update((entries) => [...entries, current]);
    });
  }

  load(): void {
    this.status.set('loading');
    this.pendingTasks.run(async () => {
      const rows = await this.fetchRows();
      this.rows.set(rows);
      this.status.set('loaded');
    });
  }

  reset(): void {
    this.rows.set([]);
    this.status.set('idle');
  }

  startTicking(): void {
    this.stopTicking();
    this.timer = setInterval(() => this.ticks.update((n) => n + 1), 1000);
  }

  stopTicking(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  private async fetchRows(): Promise<string[]> {
    await Promise.resolve();
    return ['Vitest', 'TestBed.tick', 'whenStable'];
  }
}
