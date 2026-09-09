import { Component, computed, debounced, input, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MaskedValue } from '../shared/masked-value';
import { Secret } from './secret';

@Component({
  selector: 'app-secrets-list',
  imports: [MaskedValue],
  templateUrl: './secrets-list.html',
  styleUrl: './secrets-list.css',
})
export class SecretsList {
  readonly listId = input.required<string>();

  readonly search = signal('');
  private readonly debouncedSearch = debounced(this.search, 300);

  private readonly secrets = httpResource<Secret[]>(() => {
    const params = new URLSearchParams({ listId: this.listId() });
    const term = this.debouncedSearch.value().trim();
    if (term) params.set('search', term);
    return `/api/secrets?${params}`;
  });

  readonly rows = computed(() => this.secrets.value() ?? []);
  readonly isLoading = this.secrets.isLoading;
  readonly error = this.secrets.error;
  readonly isFiltered = computed(() => this.debouncedSearch.value().trim().length > 0);

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }
}
