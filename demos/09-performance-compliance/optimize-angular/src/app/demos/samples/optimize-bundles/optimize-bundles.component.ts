import { Component, signal } from '@angular/core';

interface BudgetRow {
  type: string;
  scope: string;
  warning: string;
  error: string;
}

@Component({
  selector: 'app-bundles',
  templateUrl: './optimize-bundles.component.html',
  styleUrls: ['./optimize-bundles.component.scss'],
  imports: []
})
export class OptimizeBundlesComponent {
  readonly budgets: BudgetRow[] = [
    { type: 'initial', scope: 'Everything the browser must download before the first render', warning: '1 MB', error: '2 MB' },
    { type: 'anyComponentStyle', scope: 'Each component stylesheet', warning: '4 kB', error: '8 kB' }
  ];

  readonly pipeline = [
    { stage: 'Parse', tool: 'oxc-parser', note: 'Rust parser feeding the Angular compiler.' },
    { stage: 'Compile', tool: '@angular/compiler-cli', note: 'AOT templates, signal inputs, partial evaluation.' },
    { stage: 'Bundle', tool: 'Rolldown', note: 'Default bundler of @angular/build in v22, replacing the esbuild bundler.' },
    { stage: 'Transform', tool: 'esbuild', note: 'Still used for downleveling and minification of individual files.' },
    { stage: 'Serve', tool: 'Vite', note: 'Dev server with Rolldown-backed prebundling.' }
  ];

  readonly loadedAt = signal<number | null>(null);
  readonly stamp = signal('');
  readonly loading = signal(false);

  async loadHeavyLibrary() {
    this.loading.set(true);
    const started = performance.now();
    const moment = (await import('moment')).default;
    this.stamp.set(moment().add(1, 'days').format('MMMM Do YYYY, h:mm a'));
    this.loadedAt.set(Math.round(performance.now() - started));
    this.loading.set(false);
  }
}
