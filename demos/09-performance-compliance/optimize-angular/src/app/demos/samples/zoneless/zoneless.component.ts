import { ApplicationRef, ChangeDetectorRef, Component, PendingTasks, afterEveryRender, inject, signal } from '@angular/core';

interface Trigger {
  name: string;
  schedules: boolean;
  detail: string;
}

@Component({
  selector: 'app-zoneless',
  templateUrl: './zoneless.component.html',
  styleUrls: ['./zoneless.component.scss'],
  imports: []
})
export class ZonelessComponent {
  private cdr = inject(ChangeDetectorRef);
  private appRef = inject(ApplicationRef);
  private pendingTasks = inject(PendingTasks);

  readonly triggers: Trigger[] = [
    { name: 'signal write', schedules: true, detail: 'set(), update() or a computed that a template reads.' },
    { name: 'template event listener', schedules: true, detail: '(click), (input) and every other listener the compiler emits.' },
    { name: 'markForCheck()', schedules: true, detail: 'The manual escape hatch for state Angular cannot see.' },
    { name: 'async pipe emission', schedules: true, detail: 'The pipe marks its view when the observable emits.' },
    { name: 'httpResource / resource', schedules: true, detail: 'Their status and value are signals.' },
    { name: 'setTimeout callback', schedules: false, detail: 'Nothing patches the timer any more. Write a signal inside it.' },
    { name: 'promise resolution', schedules: false, detail: 'Same: the microtask is invisible until it touches reactive state.' },
    { name: 'addEventListener outside the template', schedules: false, detail: 'A listener you register by hand is not compiled, so it marks nothing.' }
  ];

  readonly signalTick = signal(0);
  readonly events = signal<string[]>([]);
  readonly busy = signal(false);
  readonly stability = signal('not measured yet');

  plainTick = 0;
  renders = 0;

  constructor() {
    afterEveryRender(() => {
      this.renders += 1;
    });
  }

  bumpSignalAsync() {
    this.log('signal path armed, resolving in 600ms');
    setTimeout(() => {
      this.signalTick.update(value => value + 1);
      this.log(`signal set to ${this.signalTick()} from a timer, screen refreshed`);
    }, 600);
  }

  bumpPlainAsync() {
    this.log('plain path armed, resolving in 600ms, watch without clicking');
    setTimeout(() => {
      this.plainTick += 1;
    }, 600);
  }

  bumpPlainAsyncMarked() {
    this.log('plain path armed with markForCheck, resolving in 600ms');
    setTimeout(() => {
      this.plainTick += 1;
      this.cdr.markForCheck();
    }, 600);
  }

  runTrackedTask() {
    const started = performance.now();
    const done = this.pendingTasks.add();
    this.busy.set(true);
    this.stability.set('task registered, waiting for whenStable()');
    this.log('pending task registered, the application is now unstable');

    this.appRef.whenStable().then(() => {
      this.stability.set(`whenStable() resolved after ${Math.round(performance.now() - started)} ms`);
    });

    setTimeout(() => {
      done();
      this.busy.set(false);
      this.log('pending task released');
    }, 1500);
  }

  resetRenders() {
    this.renders = 0;
  }

  private log(message: string) {
    this.events.update(list => [message, ...list].slice(0, 6));
  }
}
