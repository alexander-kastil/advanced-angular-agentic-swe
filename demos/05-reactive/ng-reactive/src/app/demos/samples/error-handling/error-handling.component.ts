import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, catchError, defer, finalize, map, of, retry, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Skill } from '../../skills/skills';
import { catchWithFallback } from './catch-with-fallback';

type Recovery = 'empty' | 'fallback' | 'rethrow';

@Component({
  selector: 'app-error-handling',
  templateUrl: './error-handling.component.html',
  styles: `
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .log { font-family: monospace; font-size: 0.82rem; max-height: 210px; overflow: auto; }
    .log div { padding: 2px 0; border-bottom: 1px solid var(--color-line); }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
    code { font-family: monospace; background: #eef2f6; border-radius: 3px; padding: 0 3px; }
  `,
})
export class ErrorHandlingComponent {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private goodUrl = `${environment.api}skills`;
  private badUrl = `${environment.api}skilz`;
  private attempt = 0;

  protected catchLog = signal<string[]>([]);
  protected retryLog = signal<string[]>([]);
  protected operatorLog = signal<string[]>([]);

  protected runCatchError(recovery: Recovery) {
    this.catchLog.set([`GET ${this.badUrl} with recovery "${recovery}"`]);

    this.http
      .get<Skill[]>(this.badUrl)
      .pipe(
        map((skills) => `${skills.length} skills`),
        catchError((err: HttpErrorResponse) => {
          this.push(this.catchLog, `catchError saw HTTP ${err.status}`);
          if (recovery === 'empty') return EMPTY;
          if (recovery === 'fallback') return of('0 skills (cached fallback)');
          return throwError(() => err);
        }),
        finalize(() => this.push(this.catchLog, 'finalize ran')),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (value) => this.push(this.catchLog, `next: ${value}`),
        error: (err: HttpErrorResponse) =>
          this.push(this.catchLog, `the subscriber's error handler ran: HTTP ${err.status}`),
        complete: () => this.push(this.catchLog, 'complete, no error reached the subscriber'),
      });
  }

  protected runRetry() {
    this.retryLog.set([]);
    this.attempt = 0;

    defer(() => {
      this.attempt += 1;
      const url = this.attempt < 3 ? this.badUrl : this.goodUrl;
      this.push(this.retryLog, `attempt ${this.attempt}: GET ${url.split('/').pop()}`);
      return this.http.get<Skill[]>(url);
    })
      .pipe(
        retry({ count: 5, delay: 600 }),
        tap({ error: (err: HttpErrorResponse) => this.push(this.retryLog, `still failing: ${err.status}`) }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (skills) => this.push(this.retryLog, `succeeded on attempt ${this.attempt} with ${skills.length} skills`),
        error: (err: HttpErrorResponse) => this.push(this.retryLog, `gave up after HTTP ${err.status}`),
      });
  }

  protected runCustomOperator() {
    this.operatorLog.set([]);

    this.http
      .get<Skill[]>(this.badUrl)
      .pipe(
        map((skills) => skills.map((skill) => skill.name)),
        catchWithFallback<string[]>(['offline placeholder'], (message) =>
          this.push(this.operatorLog, `operator reported: ${message}`),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (names) => this.push(this.operatorLog, `subscriber received: ${names.join(', ')}`),
        complete: () => this.push(this.operatorLog, 'stream completed normally'),
      });
  }

  private push(target: WritableSignal<string[]>, entry: string) {
    target.update((entries) => [...entries, entry]);
  }
}
