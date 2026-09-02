import { Component, PendingTasks, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

export type LoadStatus = 'idle' | 'loading' | 'loaded';

@Component({
  selector: 'app-zoneless-async',
  imports: [MatButtonModule, MatCardModule],
  template: `
    <div class="grid">
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>Awaited work</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>
            The load runs inside <code>PendingTasks.run()</code>, so the application counts as unstable
            until it settles and <code>fixture.whenStable()</code> waits for exactly that.
          </p>
          <div data-testid="status">status: {{ status() }}</div>
          @for (row of rows(); track row) {
            <div data-testid="row">{{ row }}</div>
          }
          <div data-testid="history">history: {{ history().join(' -> ') }}</div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" data-testid="load" (click)="load()">Load</button>
          <button mat-button data-testid="reset" (click)="reset()">Reset</button>
        </mat-card-actions>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>Timer driven state</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>
            The ticker runs on <code>setInterval</code>. A spec replaces it with Vitest fake timers and
            drives the clock by hand, then flushes rendering with <code>TestBed.tick()</code>.
          </p>
          <div data-testid="ticks">{{ ticks() }} ticks</div>
          <div data-testid="elapsed">{{ elapsed() }}</div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button data-testid="start" (click)="startTicking()">Start</button>
          <button mat-button data-testid="stop" (click)="stopTicking()">Stop</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; }
    mat-card { max-width: 30rem; }
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
