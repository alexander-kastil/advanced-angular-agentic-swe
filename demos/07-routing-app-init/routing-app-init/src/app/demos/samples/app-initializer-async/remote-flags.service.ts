import { Service, computed, signal } from '@angular/core';

@Service()
export class RemoteFlagsService {
  private readonly flags = signal<string[]>([]);

  readonly enabled = computed(() => this.flags());

  async load() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    this.flags.set(['route-inputs', 'webmcp-navigation', 'view-transitions']);
  }
}
