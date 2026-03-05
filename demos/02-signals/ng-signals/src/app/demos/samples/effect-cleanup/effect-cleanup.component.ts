import { ChangeDetectionStrategy, Component, effect, signal, Injector } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';

@Component({
    selector: 'app-effect-cleanup',
    imports: [MatButton, BoxedDirective],
    template: `
    <div boxed>
      <div>
        <p>Timer ticks: {{ ticks() }}</p>
        <p>Auto-stop interval active: {{ isRunning() }}</p>
        <p>Cleanup status: {{ cleanupStatus() }}</p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button mat-raised-button color="accent" (click)="startTimer()">
          Start Timer
        </button>
        <button mat-raised-button color="accent" (click)="stopTimer()">
          Stop Timer
        </button>
      </div>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EffectCleanupComponent {
    ticks = signal(0);
    isRunning = signal(false);
    cleanupStatus = signal('idle');
    private timerEffect: any;

    constructor(private injector: Injector) { }

    startTimer() {
        if (this.timerEffect) return;

        this.isRunning.set(true);
        this.cleanupStatus.set('timer-running');

        let interval: any;
        this.timerEffect = effect(() => {
            const running = this.isRunning();
            if (running) {
                interval = setInterval(() => {
                    this.ticks.update(t => t + 1);
                }, 1000);
            }

            return () => {
                if (interval) {
                    clearInterval(interval);
                    this.cleanupStatus.set('cleanup-executed');
                }
            };
        }, { injector: this.injector });
    }

    stopTimer() {
        this.isRunning.set(false);
        if (this.timerEffect) {
            this.timerEffect.destroy?.();
            this.timerEffect = null;
        }
    }
}
