import { ChangeDetectionStrategy, Component, effect, signal, Injector } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';

@Component({
    selector: 'app-effect-once',
    imports: [MatButton, BoxedDirective],
    template: `
    <div boxed>
      <div>
        <p>Counter: {{ counter() }}</p>
        <p>Init message: {{ initMessage() }}</p>
        <p>One-shot effect fired: {{ oneShotFired() }}</p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button mat-raised-button color="accent" (click)="increment()">
          Increment
        </button>
        <button mat-raised-button color="accent" (click)="resetAndInit()">
          Reset & Re-Init
        </button>
      </div>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EffectOnceComponent {
    counter = signal(0);
    initMessage = signal('');
    oneShotFired = signal(false);
    private onceEffect: any;

    constructor(private injector: Injector) {
        this.setupOneTimeInit();
    }

    private setupOneTimeInit() {
        this.onceEffect = effect(() => {
            const count = this.counter();
            if (count === 0) {
                this.initMessage.set('Component initialized once!');
                this.oneShotFired.set(true);
            }
        }, { injector: this.injector });
    }

    increment() {
        this.counter.update(c => c + 1);
    }

    resetAndInit() {
        this.oneShotFired.set(false);
        this.counter.set(0);
        if (this.onceEffect) {
            this.onceEffect.destroy?.();
        }
        this.setupOneTimeInit();
    }
}
