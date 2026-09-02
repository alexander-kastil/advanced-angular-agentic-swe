import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DiscountCalculator, Tier } from './discount-calculator';

@Component({
  selector: 'app-ai-generated-test',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
  ],
  template: `
    <div class="grid">
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>The unit under test</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field>
            <mat-label>Amount</mat-label>
            <input matInput type="number" data-testid="amount" [(ngModel)]="amount" />
          </mat-form-field>

          <mat-button-toggle-group [(ngModel)]="tier">
            @for (t of tiers; track t) {
              <mat-button-toggle [value]="t">{{ t }}</mat-button-toggle>
            }
          </mat-button-toggle-group>

          <div data-testid="rate">Rate: {{ ratePercent() }}</div>
          <div data-testid="total">Total: {{ total() }}</div>
          @if (error(); as message) {
            <div data-testid="error">{{ message }}</div>
          }
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>The prompt that produced the spec</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <pre>{{ prompt }}</pre>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>What to review before you trust it</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @for (check of reviewChecks; track check) {
            <div>{{ check }}</div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; }
    pre { white-space: pre-wrap; margin: 0; }
  `],
})
export class AiGeneratedTestComponent {
  readonly tiers: Tier[] = ['bronze', 'silver', 'gold'];
  readonly amount = signal(1000);
  readonly tier = signal<Tier>('gold');

  readonly result = computed(() => {
    try {
      const amount = Number(this.amount());
      return {
        rate: DiscountCalculator.rateFor(this.tier(), amount),
        total: DiscountCalculator.apply(this.tier(), amount),
        error: '',
      };
    } catch (err) {
      return { rate: 0, total: 0, error: (err as Error).message };
    }
  });

  readonly ratePercent = computed(() => Math.round(this.result().rate * 100) + '%');
  readonly total = computed(() => this.result().total);
  readonly error = computed(() => this.result().error);

  readonly prompt = [
    'Read discount-calculator.ts.',
    'Write a Vitest spec for it. No TestBed, it is a plain class.',
    'Cover every tier, both sides of the 1000 bulk threshold,',
    'the rounding rule, and both thrown errors.',
    'Assert values, never snapshots.',
  ].join('\n');

  readonly reviewChecks = [
    'Does a test fail when you break the rule it claims to cover?',
    'Are the boundary values 999 and 1000 both asserted?',
    'Did it assert behaviour, or just re-state the implementation?',
    'Are the error messages asserted by text, not by type only?',
  ];
}
