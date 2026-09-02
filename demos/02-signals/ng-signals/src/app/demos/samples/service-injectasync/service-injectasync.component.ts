import { Component, injectAsync, onIdle, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BorderDirective } from '../../../shared/formatting/formatting-directives';

@Component({
  selector: 'app-service-injectasync',
  imports: [MatButton, BorderDirective],
  template: `
    <div border class="state">
      <div>service loaded: {{ loaded() }}</div>
      <div>summary: {{ summary() }}</div>
    </div>

    <div class="actions">
      <button mat-raised-button color="accent" [disabled]="pending()" (click)="run()">
        Load service and summarize
      </button>
    </div>
  `,
  styles: `
    .state {
      display: flex;
      flex-direction: column;
      gap: var(--gap-small);
    }

    .actions {
      margin-top: var(--gap-medium);
    }
  `,
})
export class ServiceInjectAsyncComponent {
  private readonly stats = injectAsync(
    () => import('./skill-stats.service').then((m) => m.SkillStatsService),
    { prefetch: onIdle },
  );

  readonly loaded = signal(false);
  readonly pending = signal(false);
  readonly summary = signal('not requested yet');

  async run() {
    this.pending.set(true);
    const service = await this.stats();
    this.loaded.set(true);
    this.summary.set(await service.summarize());
    this.pending.set(false);
  }
}
