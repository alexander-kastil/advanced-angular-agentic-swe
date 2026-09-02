import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SlideToggleComponent } from 'src/app/shared/slide-toggle/slide-toggle.component';
import { Subscription, defer, finalize, interval, map, scan } from 'rxjs';
@Component({
  selector: 'app-subscribe-vs-stream-vs-signal',
  templateUrl: './subscribe-vs-stream-vs-signal.component.html',
  imports: [SlideToggleComponent, AsyncPipe],
  styles: `
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
    .value { font-size: 2rem; font-weight: 600; }
    code { font-size: 0.78rem; display: block; margin: 6px 0; }
    .meta { font-size: 0.8rem; color: #64748b; }
    .banner { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
    .counter { font-size: 1.1rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; background: #eef2f6; color: #17222e; }
  `,
})
export class SubscribeVsStreamVsSignalComponent {
  private destroyRef = inject(DestroyRef);
  private manualSubscription: Subscription | null = null;

  protected sourceSubscriptions = signal(0);

  private ticks$ = defer(() => {
    this.sourceSubscriptions.update((count) => count + 1);
    return interval(1000);
  }).pipe(
    map(() => Math.round(Math.random() * 100)),
    scan((average, next) => Math.round((average + next) / 2), 50),
    finalize(() => this.sourceSubscriptions.update((count) => count - 1)),
  );

  protected manual = signal(0);
  protected manualEmissions = signal(0);
  protected manualRunning = signal(false);

  protected stream$ = this.ticks$;
  protected duplicateAsync = signal(false);

  protected fromSignal = toSignal(this.ticks$, { initialValue: 0 });

  constructor() {
    this.startManual();
  }

  protected startManual() {
    if (this.manualSubscription) {
      return;
    }
    this.manualRunning.set(true);
    this.manualSubscription = this.ticks$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.manual.set(value);
      this.manualEmissions.update((count) => count + 1);
    });
  }

  protected stopManual() {
    this.manualSubscription?.unsubscribe();
    this.manualSubscription = null;
    this.manualRunning.set(false);
  }
}
