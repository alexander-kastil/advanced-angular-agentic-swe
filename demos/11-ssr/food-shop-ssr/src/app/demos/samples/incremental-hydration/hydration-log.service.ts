import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HydrationLogService {
  private readonly state = signal<Record<string, number>>({});

  readonly hydrated = this.state.asReadonly();

  mark(label: string) {
    this.state.update((current) =>
      current[label] ? current : { ...current, [label]: Math.round(performance.now()) }
    );
  }
}
