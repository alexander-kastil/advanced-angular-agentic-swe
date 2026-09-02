import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  Subject,
  catchError,
  combineLatest,
  debounceTime,
  forkJoin,
  interval,
  map,
  merge,
  of,
  shareReplay,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Skill } from '../../skills/skills';

@Component({
  selector: 'app-combining',
  templateUrl: './combining.component.html',
  imports: [FormsModule],
  styles: `
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; align-items: start; }
    .grid .card + .card { margin-top: 0; }
    .log { font-family: monospace; font-size: 0.82rem; max-height: 180px; overflow: auto; }
    .log div { padding: 2px 0; border-bottom: 1px solid var(--color-line); }
    .filters { display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap; }
    .filters .field { flex: 1 1 12rem; }
    .badge { font-size: 0.78rem; padding: 2px 6px; border-radius: 4px; background: var(--color-primary-soft); color: var(--color-primary-dark); }
  `,
})
export class CombiningComponent {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private saves = new Subject<void>();
  private ticks$ = interval(1000).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private skills$ = this.http.get<Skill[]>(`${environment.api}skills`).pipe(
    catchError(() => of([] as Skill[])),
    shareReplay(1),
  );

  protected term = signal('');
  protected onlyOpen = signal(false);
  protected combineLatestEmissions = signal(0);

  protected visible = toSignal(
    combineLatest([
      toObservable(this.term).pipe(debounceTime(200)),
      toObservable(this.onlyOpen),
      this.skills$,
    ]).pipe(
      tap(() => this.combineLatestEmissions.update((count) => count + 1)),
      map(([term, onlyOpen, skills]) =>
        skills
          .filter((skill) => skill.name.toLowerCase().includes(term.toLowerCase()))
          .filter((skill) => (onlyOpen ? !skill.completed : true)),
      ),
    ),
    { initialValue: [] as Skill[] },
  );

  protected tick = toSignal(this.ticks$, { initialValue: 0 });
  protected forkJoinLog = signal<string[]>([]);
  protected mergeLog = signal<string[]>([]);
  protected withLatestFromLog = signal<string[]>([]);
  protected draft = signal('');

  constructor() {
    this.saves
      .pipe(
        withLatestFrom(this.ticks$, toObservable(this.draft)),
        map(([, tick, draft]) => `saved "${draft}" while the ticker showed ${tick}`),
        takeUntilDestroyed(),
      )
      .subscribe((entry) => this.push(this.withLatestFromLog, entry));
  }

  protected runForkJoin() {
    this.forkJoinLog.set(['three parallel requests started ...']);
    const started = performance.now();
    const timed = <T>(name: string, url: string) =>
      this.http.get<T>(`${environment.api}${url}`).pipe(
        catchError(() => of([] as unknown as T)),
        tap((value) =>
          this.push(
            this.forkJoinLog,
            `${name} completed after ${this.elapsed(started)} with ${(value as unknown[]).length} rows`,
          ),
        ),
      );

    forkJoin({
      skills: timed<Skill[]>('skills', 'skills'),
      todos: timed<unknown[]>('todos', 'todos'),
      accounts: timed<unknown[]>('accounts', 'accounts'),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) =>
        this.push(
          this.forkJoinLog,
          `forkJoin emitted once after ${this.elapsed(started)}: ` +
            `${result.skills.length} skills, ${result.todos.length} todos, ${result.accounts.length} accounts`,
        ),
      );
  }

  protected runMerge() {
    this.mergeLog.set([]);
    const fast$ = interval(300).pipe(take(4), map((i) => `fast ${i}`));
    const slow$ = interval(800).pipe(take(2), map((i) => `slow ${i}`));

    merge(fast$, slow$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (entry) => this.push(this.mergeLog, entry),
        complete: () => this.push(this.mergeLog, 'both sources completed'),
      });
  }

  protected save() {
    this.saves.next();
  }

  private elapsed(started: number) {
    return `${Math.round(performance.now() - started)} ms`;
  }

  private push(target: WritableSignal<string[]>, entry: string) {
    target.update((entries) => [...entries, entry].slice(-12));
  }
}
