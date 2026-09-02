import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-revenue-chart',
  template: `
    <figure class="chart">
      <figcaption>Quarterly revenue, rendered by the deferred component</figcaption>
      <div class="bars">
        @for (bar of bars(); track bar.label) {
          <div class="bar" [style.height.%]="bar.height" [attr.aria-label]="bar.label + ': ' + bar.value">
            <span>{{ bar.value }}</span>
          </div>
        }
      </div>
      <button type="button" (click)="shuffle()">Recalculate</button>
    </figure>
  `,
  styles: `
    .chart { margin: 0; }
    .bars { display: flex; align-items: flex-end; gap: 12px; height: 180px; border-bottom: 1px solid var(--color-accent); }
    .bar { width: 48px; background: var(--color-primary); display: flex; align-items: flex-start; justify-content: center; color: white; font-size: 0.75rem; }
    button { margin-top: 12px; padding: 6px 14px; border: 1px solid var(--color-primary); background: transparent; color: inherit; cursor: pointer; }
  `
})
export class RevenueChartComponent {
  private readonly seed = signal(1);

  readonly bars = computed(() => {
    const offset = this.seed();
    return ['Q1', 'Q2', 'Q3', 'Q4'].map((label, index) => {
      const value = ((index + offset) * 137) % 90 + 10;
      return { label, value, height: value };
    });
  });

  shuffle() {
    this.seed.update(value => value + 1);
  }
}
