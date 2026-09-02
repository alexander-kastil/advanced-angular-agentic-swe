import { Component, DestroyRef, computed, inject, signal } from '@angular/core';

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface VitalRow {
  key: string;
  label: string;
  value: number | null;
  unit: string;
  good: number;
  poor: number;
  hint: string;
}

@Component({
  selector: 'app-lighthouse',
  templateUrl: './lighthouse.component.html',
  styleUrls: ['./lighthouse.component.scss'],
  imports: []
})
export class LighthouseComponent {
  private destroyRef = inject(DestroyRef);

  readonly lcp = signal<number | null>(null);
  readonly cls = signal<number | null>(null);
  readonly inp = signal<number | null>(null);
  readonly fcp = signal<number | null>(null);
  readonly ttfb = signal<number | null>(null);
  readonly shifted = signal(false);

  readonly vitals = computed<VitalRow[]>(() => [
    { key: 'lcp', label: 'Largest Contentful Paint', value: this.lcp(), unit: 'ms', good: 2500, poor: 4000, hint: 'Time until the largest element is painted.' },
    { key: 'inp', label: 'Interaction to Next Paint', value: this.inp(), unit: 'ms', good: 200, poor: 500, hint: 'Worst interaction latency observed so far.' },
    { key: 'cls', label: 'Cumulative Layout Shift', value: this.cls(), unit: '', good: 0.1, poor: 0.25, hint: 'Unexpected movement of visible content.' },
    { key: 'fcp', label: 'First Contentful Paint', value: this.fcp(), unit: 'ms', good: 1800, poor: 3000, hint: 'Time until the first pixel of content appears.' },
    { key: 'ttfb', label: 'Time to First Byte', value: this.ttfb(), unit: 'ms', good: 800, poor: 1800, hint: 'Server response latency for the document.' }
  ]);

  constructor() {
    const observers: PerformanceObserver[] = [];

    const observe = (type: string, handler: (entries: PerformanceEntry[]) => void, extra: Record<string, unknown> = {}) => {
      try {
        const observer = new PerformanceObserver(list => handler(list.getEntries()));
        observer.observe({ type, buffered: true, ...extra } as PerformanceObserverInit);
        observers.push(observer);
      } catch {
        return;
      }
    };

    observe('largest-contentful-paint', entries => {
      const last = entries[entries.length - 1];
      if (last) {
        this.lcp.set(Math.round(last.startTime));
      }
    });

    observe('paint', entries => {
      const first = entries.find(entry => entry.name === 'first-contentful-paint');
      if (first) {
        this.fcp.set(Math.round(first.startTime));
      }
    });

    observe('layout-shift', entries => {
      let total = this.cls() ?? 0;
      for (const entry of entries as LayoutShiftEntry[]) {
        if (!entry.hadRecentInput) {
          total += entry.value;
        }
      }
      this.cls.set(Number(total.toFixed(4)));
    });

    observe('event', entries => {
      const worst = entries.reduce((max, entry) => Math.max(max, entry.duration), this.inp() ?? 0);
      this.inp.set(Math.round(worst));
    }, { durationThreshold: 16 });

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (navigation) {
      this.ttfb.set(Math.round(navigation.responseStart));
    }

    this.destroyRef.onDestroy(() => observers.forEach(observer => observer.disconnect()));
  }

  rating(row: VitalRow): string {
    if (row.value === null) {
      return 'pending';
    }
    if (row.value <= row.good) {
      return 'good';
    }
    return row.value <= row.poor ? 'warn' : 'poor';
  }

  format(row: VitalRow): string {
    if (row.value === null) {
      return 'not measured yet';
    }
    return row.unit ? `${row.value} ${row.unit}` : `${row.value}`;
  }

  blockMainThread() {
    const until = performance.now() + 320;
    while (performance.now() < until) {
      Math.sqrt(Math.random());
    }
    this.inp.update(current => current ?? 0);
  }

  triggerShift() {
    this.shifted.update(value => !value);
  }
}
