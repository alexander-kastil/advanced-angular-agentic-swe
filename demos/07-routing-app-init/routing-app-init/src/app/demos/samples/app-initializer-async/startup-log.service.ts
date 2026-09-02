import { Service, computed, signal } from '@angular/core';

export interface StartupEntry {
  at: number;
  message: string;
}

@Service()
export class StartupLogService {
  private readonly started = Date.now();
  private readonly items = signal<StartupEntry[]>([]);

  readonly entries = computed(() => this.items());

  record(message: string) {
    this.items.update((entries) => [...entries, { at: Date.now() - this.started, message }]);
  }
}
