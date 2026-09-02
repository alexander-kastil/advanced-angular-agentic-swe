import { Injectable, signal } from '@angular/core';

export interface TimelineEntry {
  label: string;
  chunk: string;
  offset: number;
}

@Injectable()
export class DeferTimeline {
  private readonly start = performance.now();
  readonly entries = signal<TimelineEntry[]>([]);

  record(label: string, chunk: string) {
    const offset = Math.round(performance.now() - this.start);
    queueMicrotask(() => this.entries.update(list => [...list, { label, chunk, offset }]));
  }

  since(): number {
    return this.start;
  }

  reset() {
    this.entries.set([]);
  }
}
