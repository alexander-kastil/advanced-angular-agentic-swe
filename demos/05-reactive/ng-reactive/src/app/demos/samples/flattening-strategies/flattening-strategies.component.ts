import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import {
  Subject,
  catchError,
  concatMap,
  defer,
  delay,
  exhaustMap,
  finalize,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Skill } from '../../skills/skills';

type Strategy = 'switchMap' | 'mergeMap' | 'concatMap' | 'exhaustMap';

interface Fire {
  id: number;
  firedAt: number;
}

interface Pane {
  subscribed: number;
  inFlight: number;
  delivered: number;
  log: string[];
}

const EMPTY_PANE: Pane = { subscribed: 0, inFlight: 0, delivered: 0, log: [] };

@Component({
  selector: 'app-flattening-strategies',
  templateUrl: './flattening-strategies.component.html',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatButton],
  styles: `
    .strategies { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 16px; }
    .counters { display: flex; gap: 12px; font-size: 0.78rem; margin-bottom: 6px; }
    .counters span { padding: 2px 6px; border-radius: 4px; background: rgba(128, 128, 128, 0.15); }
    .busy { background: rgba(255, 152, 0, 0.35); font-weight: 700; }
    .log { font-family: monospace; font-size: 0.8rem; max-height: 200px; overflow: auto; }
    .log div { padding: 2px 0; border-bottom: 1px solid rgba(128, 128, 128, 0.25); }
    .cancelled { opacity: 0.6; text-decoration: line-through; }
    .actions { display: flex; gap: 8px; align-items: center; }
  `,
})
export class FlatteningStrategiesComponent {
  private http = inject(HttpClient);
  private url = `${environment.api}skills`;
  private latency = 1500;

  private requests: Record<Strategy, Subject<Fire>> = {
    switchMap: new Subject<Fire>(),
    mergeMap: new Subject<Fire>(),
    concatMap: new Subject<Fire>(),
    exhaustMap: new Subject<Fire>(),
  };

  protected strategies: Strategy[] = ['switchMap', 'mergeMap', 'concatMap', 'exhaustMap'];
  protected fired = signal(0);

  protected panes = signal<Record<Strategy, Pane>>({
    switchMap: { ...EMPTY_PANE, log: [] },
    mergeMap: { ...EMPTY_PANE, log: [] },
    concatMap: { ...EMPTY_PANE, log: [] },
    exhaustMap: { ...EMPTY_PANE, log: [] },
  });

  protected descriptions: Record<Strategy, string> = {
    switchMap: 'cancels the request in flight, only the newest survives',
    mergeMap: 'subscribes to everything at once, order is completion order',
    concatMap: 'queues requests, each one waits for the previous to finish',
    exhaustMap: 'ignores new clicks while a request is still running',
  };

  constructor() {
    this.requests.switchMap
      .pipe(switchMap((fire) => this.slowRequest('switchMap', fire)), takeUntilDestroyed())
      .subscribe((entry) => this.append('switchMap', entry));

    this.requests.mergeMap
      .pipe(mergeMap((fire) => this.slowRequest('mergeMap', fire)), takeUntilDestroyed())
      .subscribe((entry) => this.append('mergeMap', entry));

    this.requests.concatMap
      .pipe(concatMap((fire) => this.slowRequest('concatMap', fire)), takeUntilDestroyed())
      .subscribe((entry) => this.append('concatMap', entry));

    this.requests.exhaustMap
      .pipe(exhaustMap((fire) => this.slowRequest('exhaustMap', fire)), takeUntilDestroyed())
      .subscribe((entry) => this.append('exhaustMap', entry));
  }

  protected fire() {
    const id = this.fired() + 1;
    const firedAt = performance.now();
    this.fired.set(id);
    for (const strategy of this.strategies) {
      this.requests[strategy].next({ id, firedAt });
    }
  }

  protected reset() {
    this.fired.set(0);
    this.panes.set({
      switchMap: { ...EMPTY_PANE, log: [] },
      mergeMap: { ...EMPTY_PANE, log: [] },
      concatMap: { ...EMPTY_PANE, log: [] },
      exhaustMap: { ...EMPTY_PANE, log: [] },
    });
  }

  private slowRequest(strategy: Strategy, { id, firedAt }: Fire) {
    let delivered = false;

    return defer(() => {
      this.patch(strategy, (pane) => ({
        ...pane,
        subscribed: pane.subscribed + 1,
        inFlight: pane.inFlight + 1,
      }));
      return this.http.get<Skill[]>(this.url);
    }).pipe(
      delay(this.latency),
      map((skills) => `#${id} resolved ${skills.length} skills ${this.elapsed(firedAt)} after the click`),
      catchError(() => of(`#${id} failed, is json-server running?`)),
      tap(() => {
        delivered = true;
        this.patch(strategy, (pane) => ({ ...pane, delivered: pane.delivered + 1 }));
      }),
      finalize(() => {
        this.patch(strategy, (pane) => ({ ...pane, inFlight: pane.inFlight - 1 }));
        if (!delivered) {
          this.append(strategy, `#${id} cancelled ${this.elapsed(firedAt)} after the click`);
        }
      }),
    );
  }

  private elapsed(from: number) {
    return `${Math.round(performance.now() - from)} ms`;
  }

  private append(strategy: Strategy, entry: string) {
    this.patch(strategy, (pane) => ({ ...pane, log: [entry, ...pane.log].slice(0, 12) }));
  }

  private patch(strategy: Strategy, change: (pane: Pane) => Pane) {
    this.panes.update((panes) => ({ ...panes, [strategy]: change(panes[strategy]) }));
  }
}
