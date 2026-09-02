import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { runShippingContract } from './shipping-contract';
import { mutants } from './shipping-mutants';
import { Zone, shippingCost } from './shipping-rules';

@Component({
  selector: 'app-ai-writes-the-test',
  imports: [FormsModule],
  template: `
    <div class="grid">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">1. State the behaviour</h2>
        </div>
        <div class="card-content">
          @for (rule of behaviour; track rule) {
            <div data-testid="behaviour-rule">{{ rule }}</div>
          }
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">2. The prompt the agent gets</h2>
        </div>
        <div class="card-content">
          <pre data-testid="prompt" tabindex="0" role="region" aria-label="Agent prompt">{{ prompt }}</pre>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">The unit under test</h2>
        </div>
        <div class="card-content">
          <div class="field">
            <label class="label" for="weight">Weight in kg</label>
            <input
              id="weight"
              class="input"
              type="number"
              data-testid="weight"
              [(ngModel)]="weightKg"
            />
          </div>

          <div class="field">
            <label class="label" for="subtotal">Subtotal</label>
            <input
              id="subtotal"
              class="input"
              type="number"
              data-testid="subtotal"
              [(ngModel)]="subtotal"
            />
          </div>

          <div class="toggle-group" role="group" aria-label="Zone">
            @for (z of zones; track z) {
              <button
                type="button"
                class="toggle-btn"
                [class.active]="zone() === z"
                [attr.aria-pressed]="zone() === z"
                (click)="zone.set(z)"
              >
                {{ z }}
              </button>
            }
          </div>

          <label class="checkbox">
            <input type="checkbox" [(ngModel)]="express" />
            Express
          </label>

          <div class="quote" data-testid="quote">{{ quote() }}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">3. Review the generated spec</h2>
        </div>
        <div class="card-content">
          @for (check of checklist; track check) {
            <div data-testid="checklist-item">{{ check }}</div>
          }
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">4. Mutation round</h2>
        </div>
        <div class="card-content">
          <p>Every row breaks one rule on purpose. A suite worth keeping goes red on all of them.</p>
          @for (row of mutationReport(); track row.name) {
            <div class="mutant" data-testid="mutant-row">
              <b>{{ row.name }}</b> - {{ row.change }}
              <div [class.killed]="row.killed" [class.survived]="!row.killed">
                {{ row.killed ? 'killed by: ' + row.killedBy : 'SURVIVED - the suite is blind here' }}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; }
    .grid .card + .card { margin-top: 0; }
    .card { max-width: 34rem; }
    .toggle-group, .checkbox { align-self: flex-start; }
    pre { white-space: pre-wrap; margin: 0; overflow-x: auto; }
    .quote { margin-top: 1rem; font-size: 1.4rem; }
    .mutant { margin-bottom: .6rem; }
    .killed { color: #15803d; }
    .survived { color: #b91c1c; }
  `],
})
export class AiWritesTheTestComponent {
  readonly zones: Zone[] = ['domestic', 'eu', 'world'];

  readonly zone = signal<Zone>('domestic');
  readonly weightKg = signal(6.4);
  readonly subtotal = signal(120);
  readonly express = signal(false);

  readonly quote = computed(() => {
    try {
      const cost = shippingCost({
        zone: this.zone(),
        weightKg: Number(this.weightKg()),
        subtotal: Number(this.subtotal()),
        express: this.express(),
      });
      return cost === 0 ? 'free shipping' : cost.toFixed(2);
    } catch (err) {
      return (err as Error).message;
    }
  });

  readonly mutationReport = computed(() =>
    mutants.map((mutant) => {
      const failed = runShippingContract(mutant.quote).filter((r) => !r.passed);
      return {
        name: mutant.name,
        change: mutant.change,
        killed: failed.length > 0,
        killedBy: failed[0]?.name ?? '',
      };
    })
  );

  readonly behaviour = [
    'Base rate per zone: domestic 4.90, EU 9.90, world 19.90.',
    'Express doubles the base rate. It does not double the heavy surcharge.',
    'Above 5 kg add a flat 5.00 plus 1.10 for every kilogram over 5. Exactly 5 kg is light.',
    'Domestic orders from a subtotal of 100 ship free, unless express was chosen.',
    'A weight of zero or less throws "Weight must be positive".',
    'An unknown zone throws "Unknown zone".',
    'Every quote is rounded to two decimals.',
  ];

  readonly prompt = [
    'Call get_best_practices for this workspace first, then read shipping-rules.ts.',
    'Write a Vitest spec next to it. Plain functions, no TestBed.',
    'One it() per rule in the behaviour statement below, plus both sides of every',
    'boundary: 5 kg, a subtotal of exactly 100, and express against free shipping.',
    'Assert exact numbers and exact error messages. No snapshots, no toBeTruthy.',
    'Run it with run_target target=test and paste the failing output before you fix anything.',
  ].join('\n');

  readonly checklist = [
    'One assertion per rule, and every rule from the statement is present.',
    'Both sides of each boundary are asserted, not just the happy side.',
    'Numbers are literals the reviewer can check, not expressions copied from the code.',
    'Errors are matched by message, never a bare toThrow().',
    'No test re-states the implementation (expect(rates[z]).toBe(rates[z])).',
    'The mutation round below is green: every deliberate break is caught.',
  ];
}
