import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { DeferTimeline } from './defer-timeline.service';
import { HeavyPanelComponent } from './heavy-panel.component';
import { LightPanelComponent } from './light-panel.component';

interface ChunkRow {
  file: string;
  encoded: number;
  transferred: number;
  duration: number;
  offset: number;
}

@Component({
  selector: 'app-defer-by-trigger',
  templateUrl: './defer-by-trigger.component.html',
  styleUrls: ['./defer-by-trigger.component.scss'],
  providers: [DeferTimeline],
  imports: [LightPanelComponent, HeavyPanelComponent]
})
export class DeferByTriggerComponent {
  private destroyRef = inject(DestroyRef);
  readonly timeline = inject(DeferTimeline);

  readonly armed = signal(false);
  readonly chunks = signal<ChunkRow[]>([]);

  readonly totalTransferred = computed(() => this.chunks().reduce((sum, row) => sum + row.transferred, 0));

  constructor() {
    const start = this.timeline.since();
    let observer: PerformanceObserver | null = null;

    try {
      observer = new PerformanceObserver(list => {
        const rows: ChunkRow[] = [];
        for (const entry of list.getEntries() as PerformanceResourceTiming[]) {
          if (entry.initiatorType !== 'script' || entry.startTime < start) {
            continue;
          }
          rows.push({
            file: this.label(entry.name),
            encoded: entry.encodedBodySize,
            transferred: entry.transferSize,
            duration: Math.round(entry.duration),
            offset: Math.round(entry.startTime - start)
          });
        }
        if (rows.length) {
          this.chunks.update(current => [...current, ...rows]);
        }
      });
      observer.observe({ type: 'resource', buffered: false });
    } catch {
      observer = null;
    }

    this.destroyRef.onDestroy(() => observer?.disconnect());
  }

  arm() {
    this.armed.set(true);
  }

  kb(bytes: number): string {
    return bytes === 0 ? 'not reported' : `${(bytes / 1024).toFixed(1)} kB`;
  }

  private label(url: string): string {
    const decoded = decodeURIComponent(url);
    const symbol = decoded.split('@').pop();
    if (decoded.includes('/@ng/component') && symbol) {
      return symbol;
    }
    return decoded.split('?')[0].split('/').pop() ?? decoded;
  }
}
