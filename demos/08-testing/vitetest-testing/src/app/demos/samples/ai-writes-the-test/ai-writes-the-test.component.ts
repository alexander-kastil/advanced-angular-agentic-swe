import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { runShippingContract } from './shipping-contract';
import { mutants } from './shipping-mutants';
import { Zone, shippingCost } from './shipping-rules';

@Component({
  selector: 'app-ai-writes-the-test',
  imports: [
    FormsModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="grid">
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>1. State the behaviour</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @for (rule of behaviour; track rule) {
            <div data-testid="behaviour-rule">{{ rule }}</div>
          }
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>2. The prompt the agent gets</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <pre data-testid="prompt">{{ prompt }}</pre>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>The unit under test</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field>
            <mat-label>Weight in kg</mat-label>
            <input matInput type="number" data-testid="weight" [(ngModel)]="weightKg" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Subtotal</mat-label>
            <input matInput type="number" data-testid="subtotal" [(ngModel)]="subtotal" />
          </mat-form-field>

          <mat-button-toggle-group [(ngModel)]="zone">
            @for (z of zones; track z) {
              <mat-button-toggle [value]="z">{{ z }}</mat-button-toggle>
            }
          </mat-button-toggle-group>

          <mat-checkbox [(ngModel)]="express">Express</mat-checkbox>

          <div class="quote" data-testid="quote">{{ quote() }}</div>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>3. Review the generated spec</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @for (check of checklist; track check) {
            <div data-testid="checklist-item">{{ check }}</div>
          }
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>4. Mutation round</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Every row breaks one rule on purpose. A suite worth keeping goes red on all of them.</p>
          @for (row of mutationReport(); track row.name) {
            <div class="mutant" data-testid="mutant-row">
              <b>{{ row.name }}</b> - {{ row.change }}
              <div [class.killed]="row.killed" [class.survived]="!row.killed">
                {{ row.killed ? 'killed by: ' + row.killedBy : 'SURVIVED - the suite is blind here' }}
              </div>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; }
    mat-card { max-width: 34rem; }
    pre { white-space: pre-wrap; margin: 0; }
    .quote { margin-top: 1rem; font-size: 1.4rem; }
    .mutant { margin-bottom: .6rem; }
    .killed { color: #66bb6a; }
    .survived { color: #ef5350; }
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
