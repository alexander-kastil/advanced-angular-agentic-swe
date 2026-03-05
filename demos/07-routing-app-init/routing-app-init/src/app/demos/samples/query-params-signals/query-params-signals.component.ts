import { ChangeDetectionStrategy, Component, computed, input, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { JsonPipe, CommonModule } from '@angular/common';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-query-params-signals',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        MarkdownRendererComponent,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatCardActions,
        MatButton,
        MatFormField,
        MatLabel,
        MatInput,
        MatCheckbox,
        JsonPipe,
    ],
    template: `
    <app-markdown-renderer [md]="'query-params-signals'" />

    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title>Query Parameters with Signals</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="form-group">
          <mat-form-field>
            <mat-label>Search Query</mat-label>
            <input 
              matInput 
              [value]="searchQuery()" 
              (change)="onSearchChange($event)">
          </mat-form-field>
        </div>

        <div class="form-group">
          <mat-checkbox 
            [checked]="showRecent()"
            (change)="onShowRecentChange($event)">
            Show Recent Results
          </mat-checkbox>
        </div>

        <h3>Current Query State</h3>
        <pre>{{ currentState() | json }}</pre>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="clearParams()">
          Clear Params
        </button>
        <button mat-raised-button color="accent" (click)="setDefaults()">
          Reset Defaults
        </button>
      </mat-card-actions>
    </mat-card>
  `,
    styles: [`
    .form-group {
      margin-bottom: 16px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class QueryParamsSignalsComponent {
    private router = inject(Router);

    readonly searchQuery = signal('');
    readonly showRecent = signal(true);

    readonly currentState = computed(() => ({
        search: this.searchQuery(),
        showRecent: this.showRecent(),
        timestamp: new Date().toISOString(),
    }));

    onSearchChange(event: any) {
        this.searchQuery.set(event.target.value);
        this.updateQueryParams();
    }

    onShowRecentChange(event: any) {
        this.showRecent.set(event.checked);
        this.updateQueryParams();
    }

    private updateQueryParams() {
        this.router.navigate([], {
            queryParams: {
                q: this.searchQuery() || undefined,
                showRecent: this.showRecent() ? undefined : 'false'
            },
            queryParamsHandling: 'merge',
        });
    }

    clearParams() {
        this.searchQuery.set('');
        this.showRecent.set(true);
        this.router.navigate([], {
            queryParams: {},
        });
    }

    setDefaults() {
        this.searchQuery.set('angular');
        this.showRecent.set(true);
        this.updateQueryParams();
    }
}
