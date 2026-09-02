import { Injectable, signal } from '@angular/core';

export interface ErrorEntry {
  url: string;
  status: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ErrorLogService {
  private readonly entries = signal<ErrorEntry[]>([]);

  readonly log = this.entries.asReadonly();

  record(entry: ErrorEntry): void {
    this.entries.update((all) => [...all, entry]);
  }

  clear(): void {
    this.entries.set([]);
  }
}
