import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ErrorLogService } from './error-log.service';
import { describeHttpError } from './error-mapping.interceptor';
import { UnstableApiService } from './unstable-api.service';

@Component({
  selector: 'app-http-error-tests',
  template: `
    <div class="grid">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Error paths</h2>
        </div>
        <div class="card-content">
          <p>
            Each button hits an endpoint that the spec answers with a failure. The interceptor turns the
            status code into the sentence below and records it. Running in the browser without that
            interceptor, the component maps and records the same failure itself.
          </p>
          <div class="actions">
            <button type="button" class="btn btn-primary" data-testid="load" (click)="load()">
              GET customers
            </button>
            <button type="button" class="btn btn-outline" data-testid="missing" (click)="loadMissing()">
              GET a missing customer
            </button>
            <button type="button" class="btn btn-warn" data-testid="save" (click)="save()">
              PUT a stale customer
            </button>
          </div>

          <div data-testid="outcome">{{ outcome() }}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Error log</h2>
        </div>
        <div class="card-content">
          @for (entry of errors.log(); track $index) {
            <div data-testid="log-entry">{{ entry.status }} {{ entry.url }} - {{ entry.message }}</div>
          } @empty {
            <div data-testid="log-empty">No errors recorded</div>
          }
        </div>
        <div class="card-actions">
          <button type="button" class="btn btn-outline" data-testid="clear" (click)="errors.clear()">Clear</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; }
    .card { max-width: 30rem; margin-top: 0; }
    .actions { display: flex; flex-wrap: wrap; gap: .5rem; }
    .outcome { font-family: monospace; }
  `],
})
export class HttpErrorTestsComponent {
  private readonly api = inject(UnstableApiService);

  readonly errors = inject(ErrorLogService);
  readonly outcome = signal('nothing requested yet');

  load(): void {
    this.api.load().subscribe({
      next: (customers) => this.outcome.set(`loaded ${customers.length} customers`),
      error: (err: unknown) => this.fail(err),
    });
  }

  loadMissing(): void {
    this.api.loadOne(9999).subscribe({
      next: (customer) => this.outcome.set(`loaded ${customer.name}`),
      error: (err: unknown) => this.fail(err),
    });
  }

  save(): void {
    this.api.save({ id: 1, name: 'Stale' }).subscribe({
      next: (customer) => this.outcome.set(`saved ${customer.name}`),
      error: (err: unknown) => this.fail(err),
    });
  }

  private fail(err: unknown): void {
    if (err instanceof HttpErrorResponse) {
      const message = describeHttpError(err);
      this.errors.record({ url: err.url ?? '', status: err.status, message });
      this.outcome.set(message);
      return;
    }
    this.outcome.set((err as Error).message);
  }
}
