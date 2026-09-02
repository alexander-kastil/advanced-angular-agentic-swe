import { Component, DestroyRef, computed, enableProfiling, inject, isDevMode, signal } from '@angular/core';

interface Measure {
  name: string;
  duration: number;
  at: string;
}

interface Reading {
  symptom: string;
  track: string;
  cause: string;
  fix: string;
}

@Component({
  selector: 'app-devtools-profiling',
  templateUrl: './devtools-profiling.component.html',
  styleUrls: ['./devtools-profiling.component.scss'],
  imports: []
})
export class DevtoolsProfilingComponent {
  private destroyRef = inject(DestroyRef);
  private stopProfiling: (() => void) | null = null;

  readonly devMode = isDevMode();
  readonly profiling = signal(false);
  readonly measures = signal<Measure[]>([]);
  readonly rowCount = signal(20);
  readonly seed = signal(1);

  readonly rows = computed(() => {
    const count = this.rowCount();
    const offset = this.seed();
    return Array.from({ length: count }, (_, index) => ({
      id: index,
      label: `row ${index + 1}`,
      value: ((index + offset) * 7919) % 1000
    }));
  });

  readonly slowest = computed(() => {
    const list = this.measures();
    return list.length === 0 ? null : list.reduce((worst, row) => (row.duration > worst.duration ? row : worst));
  });

  readonly readings: Reading[] = [
    {
      symptom: 'One long purple block on the main thread',
      track: 'Main',
      cause: 'A single change detection pass doing too much, usually a costly expression called from a template.',
      fix: 'Move the work into a computed() so it runs once per input change, not once per pass.'
    },
    {
      symptom: 'Many short change detection bars in a row',
      track: 'Angular',
      cause: 'Something writes a signal in a loop, or an effect writes a signal another effect reads.',
      fix: 'Batch the writes, or derive with computed() instead of writing from an effect.'
    },
    {
      symptom: 'A component reappears in every pass you did not touch',
      track: 'Angular',
      cause: 'The view is being marked dirty from a parent, or an object identity changes on every read.',
      fix: 'Give @for a stable track expression and stop rebuilding arrays in getters.'
    },
    {
      symptom: 'A wide flame under Recalculate Style / Layout',
      track: 'Main',
      cause: 'The template writes layout-affecting styles during render, so the browser reflows.',
      fix: 'Batch DOM reads and writes with afterEveryRender phases (earlyRead, write, read).'
    },
    {
      symptom: 'A gap between the click and the next paint',
      track: 'Interactions',
      cause: 'Input delay: the main thread was busy when the event arrived. This is what INP measures.',
      fix: 'Split the work, defer it, or move it off the main thread.'
    }
  ];

  constructor() {
    this.destroyRef.onDestroy(() => this.stopProfiling?.());
  }

  toggleProfiling() {
    if (this.stopProfiling) {
      this.stopProfiling();
      this.stopProfiling = null;
      this.profiling.set(false);
      return;
    }
    this.stopProfiling = enableProfiling();
    this.profiling.set(true);
  }

  cheapUpdate() {
    this.measure('cheap: one signal write', () => this.seed.update(value => value + 1));
  }

  wideUpdate() {
    this.measure('wide: 2000 rows re-rendered', () => {
      this.rowCount.set(this.rowCount() === 2000 ? 20 : 2000);
      this.seed.update(value => value + 1);
    });
  }

  longTask() {
    this.measure('long task: 300 ms of blocking work', () => {
      const until = performance.now() + 300;
      let sink = 0;
      while (performance.now() < until) {
        sink += Math.sqrt(Math.random());
      }
      this.seed.update(value => value + (sink > 0 ? 1 : 0));
    });
  }

  clear() {
    this.measures.set([]);
    performance.clearMarks();
    performance.clearMeasures();
  }

  private measure(name: string, work: () => void) {
    const start = `${name}:start`;
    const end = `${name}:end`;
    performance.mark(start);
    work();
    performance.mark(end);
    const entry = performance.measure(name, start, end);
    this.measures.update(list => [
      { name, duration: Number(entry.duration.toFixed(2)), at: new Date().toLocaleTimeString() },
      ...list
    ].slice(0, 8));
  }
}
