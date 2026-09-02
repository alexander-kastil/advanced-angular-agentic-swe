import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DiscountCalculator, Tier } from './discount-calculator';

@Component({
  selector: 'app-ai-generated-test',
  imports: [FormsModule],
  template: `
    <div class="grid">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">The unit under test</h2>
        </div>
        <div class="card-content">
          <div class="field">
            <label class="label" for="amount">Amount</label>
            <input
              id="amount"
              class="input"
              type="number"
              data-testid="amount"
              [(ngModel)]="amount"
            />
          </div>

          <div class="toggle-group" role="group" aria-label="Tier">
            @for (t of tiers; track t) {
              <button
                type="button"
                class="toggle-btn"
                [class.active]="tier() === t"
                [attr.aria-pressed]="tier() === t"
                (click)="tier.set(t)"
              >
                {{ t }}
              </button>
            }
          </div>

          <div data-testid="rate">Rate: {{ ratePercent() }}</div>
          <div data-testid="total">Total: {{ total() }}</div>
          @if (error(); as message) {
            <div data-testid="error">{{ message }}</div>
          }
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">The prompt that produced the spec</h2>
        </div>
        <div class="card-content">
          <pre tabindex="0" role="region" aria-label="Spec generation prompt">{{ prompt }}</pre>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">What to review before you trust it</h2>
        </div>
        <div class="card-content">
          @for (check of reviewChecks; track check) {
            <div>{{ check }}</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; }
    .grid .card + .card { margin-top: 0; }
    .toggle-group { align-self: flex-start; }
    pre { white-space: pre-wrap; margin: 0; overflow-x: auto; }
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
