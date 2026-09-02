import { Service, computed, signal } from '@angular/core';

let instances = 0;

@Service({ autoProvided: false })
export class RouteScopedNotesService {
  readonly instanceId = ++instances;

  private readonly items = signal<string[]>([]);

  readonly notes = computed(() => this.items());
  readonly count = computed(() => this.items().length);

  add(note: string) {
    this.items.update((notes) => [...notes, note]);
  }
}
