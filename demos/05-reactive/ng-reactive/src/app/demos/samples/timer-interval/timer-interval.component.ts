import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { BehaviorSubject, interval, timer } from 'rxjs';
import { delay, map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-timer-interval',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatButton, AsyncPipe],
  templateUrl: './timer-interval.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerIntervalComponent {
  private destroyRef = inject(DestroyRef);

  protected ticker = signal(0);
  protected timerFired = signal(false);
  protected delayedValue = signal<number | null>(null);
  protected timerLog$ = new BehaviorSubject<string[]>([]);

  startInterval() {
    this.ticker.set(0);
    interval(1000)
      .pipe(take(10), takeUntilDestroyed(this.destroyRef))
      .subscribe(n => this.ticker.set(n + 1));
  }

  startTimer() {
    this.timerFired.set(false);
    timer(2000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.timerFired.set(true));
  }

  useDelay() {
    this.delayedValue.set(null);
    interval(500).pipe(
      take(5),
      map(n => n * 10),
      delay(1000),
      tap(v => this.timerLog$.next([...this.timerLog$.value, `delay emitted: ${v}`])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(v => this.delayedValue.set(v));
  }
}
