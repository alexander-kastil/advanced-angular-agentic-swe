import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ErrorLogService } from './error-log.service';
import { describeHttpError } from './error-mapping.interceptor';
import { UnstableApiService } from './unstable-api.service';

@Component({
  selector: 'app-http-error-tests',
  imports: [MatButtonModule, MatCardModule],
  template: `
    <div class="grid">
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>Error paths</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>
            Each button hits an endpoint that the spec answers with a failure. The interceptor turns the
            status code into the sentence below and records it. Running in the browser without that
            interceptor, the component maps and records the same failure itself.
          </p>
          <div class="actions">
            <button mat-raised-button color="primary" data-testid="load" (click)="load()">
              GET customers
            </button>
            <button mat-raised-button data-testid="missing" (click)="loadMissing()">
              GET a missing customer
            </button>
            <button mat-raised-button color="warn" data-testid="save" (click)="save()">
              PUT a stale customer
            </button>
          </div>

          <div data-testid="outcome">{{ outcome() }}</div>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>Error log</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @for (entry of errors.log(); track $index) {
            <div data-testid="log-entry">{{ entry.status }} {{ entry.url }} - {{ entry.message }}</div>
          } @empty {
            <div data-testid="log-empty">No errors recorded</div>
          }
        </mat-card-content>
        <mat-card-actions>
          <button mat-button data-testid="clear" (click)="errors.clear()">Clear</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; }
    mat-card { max-width: 30rem; }
    .actions { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1rem; }
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
