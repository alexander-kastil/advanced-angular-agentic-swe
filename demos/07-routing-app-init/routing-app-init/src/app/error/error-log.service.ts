import { Service, computed, signal } from '@angular/core';

export interface ErrorEntry {
  source: 'ErrorHandler' | 'NavigationError';
  message: string;
  at: string;
}

@Service()
export class ErrorLogService {
  private readonly items = signal<ErrorEntry[]>([]);

  readonly entries = computed(() => this.items());

  record(source: ErrorEntry['source'], message: string) {
    this.items.update((entries) => [
      { source, message, at: new Date().toLocaleTimeString() },
      ...entries,
    ]);
  }
}
