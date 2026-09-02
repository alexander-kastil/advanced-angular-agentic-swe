import { Service, computed, signal } from '@angular/core';

let instances = 0;

@Service()
export class AppWideNotesService {
  readonly instanceId = ++instances;

  private readonly items = signal<string[]>([]);

  readonly notes = computed(() => this.items());
  readonly count = computed(() => this.items().length);

  add(note: string) {
    this.items.update((notes) => [...notes, note]);
  }
}
