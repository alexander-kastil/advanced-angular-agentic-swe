import { afterNextRender, Component, computed, signal } from '@angular/core';
import { CodePanelComponent } from '../../../shared/code-panel/code-panel.component';
import { MEASURED_AT, MEASUREMENTS } from './measurements';

interface LiveTiming {
  label: string;
  value: string;
}

@Component({
  selector: 'app-csr-vs-ssr-delta',
  imports: [CodePanelComponent],
  templateUrl: './csr-vs-ssr-delta.component.html',
  styleUrl: './csr-vs-ssr-delta.component.scss',
})
export class CsrVsSsrDeltaComponent {
  readonly measurements = MEASUREMENTS;
  readonly measuredAt = MEASURED_AT;

  readonly live = signal<LiveTiming[]>([]);
  readonly hasLive = computed(() => this.live().length > 0);

  readonly baseline = computed(() => this.measurements.find((row) => row.mode === 'CSR shell'));

  readonly method = `npm run build
node dist/food-shop-ssr/server/server.mjs

# seven warm runs per path, median reported
for p in / /food/2 /food/99 /index.csr.html; do
  for i in 1 2 3 4 5 6 7; do
    curl -s -o /dev/null -w '%{time_starttransfer} %{size_download}\\n' \\
      "http://localhost:4000$p"
  done
done

# content check: does the first response already carry the dish?
curl -s http://localhost:4000/food/2 | grep -c 'Blini with Salmon'`;

  readonly clientBaseline = `{ path: 'csr-only', renderMode: RenderMode.Client }`;

  bytes(value: number): string {
    return `${(value / 1024).toFixed(1)} kB`;
  }

  private readonly fcp = signal<number | null>(null);

  constructor() {
    afterNextRender(() => {
      const observer = new PerformanceObserver((list) => {
        const entry = list.getEntriesByName('first-contentful-paint')[0];
        if (entry) {
          this.fcp.set(Math.round(entry.startTime));
          this.readTimings();
          observer.disconnect();
        }
      });
      observer.observe({ type: 'paint', buffered: true });
      this.readTimings();
    });
  }

  private readTimings() {
    const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (!nav) {
      return;
    }

    const paint = this.fcp();

    this.live.set([
      { label: 'time to first byte', value: `${Math.round(nav.responseStart)} ms` },
      { label: 'html fully received', value: `${Math.round(nav.responseEnd)} ms` },
      { label: 'dom content loaded', value: `${Math.round(nav.domContentLoadedEventEnd)} ms` },
      { label: 'transferred bytes', value: `${nav.transferSize} B` },
      { label: 'first contentful paint', value: paint === null ? 'waiting' : `${paint} ms` },
      { label: 'navigation type', value: nav.type },
    ]);
  }
}
