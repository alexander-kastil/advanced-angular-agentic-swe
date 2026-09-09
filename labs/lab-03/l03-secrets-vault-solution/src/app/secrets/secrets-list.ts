import { Component, computed, debounced, input, output, signal, viewChildren } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { CategoryChips } from './category-chips';
import { Category } from './category';
import { Secret } from './secret';
import { SecretMenu } from './secret-menu';
import { SecretRow } from './secret-row';

@Component({
  selector: 'app-secrets-list',
  imports: [CategoryChips, SecretMenu, SecretRow],
  templateUrl: './secrets-list.html',
  styleUrl: './secrets-list.css',
})
export class SecretsList {
  readonly listId = input.required<string>();
  readonly opened = output<Secret>();

  readonly search = signal('');
  readonly selectedCategories = signal<string[]>([]);
  private readonly debouncedSearch = debounced(this.search, 300);

  readonly secrets = httpResource<Secret[]>(() => {
    const params = new URLSearchParams({ listId: this.listId() });
    const term = this.debouncedSearch.value().trim();
    if (term) params.set('search', term);
    return `/api/secrets?${params}`;
  });

  private readonly categoriesResource = httpResource<Category[]>(
    () => `/api/categories?listId=${this.listId()}`,
  );

  readonly categories = computed(() => this.categoriesResource.value() ?? []);

  readonly rows = computed(() => {
    const wanted = this.selectedCategories();
    const all = this.secrets.value() ?? [];
    if (wanted.length === 0) return all;
    return all.filter((secret) => secret.categoryIds.some((id) => wanted.includes(id)));
  });

  private readonly rowComponents = viewChildren(SecretRow);
  readonly renderedCount = computed(() => this.rowComponents().length);
  readonly loadedCount = computed(() => (this.secrets.value() ?? []).length);

  readonly isLoading = this.secrets.isLoading;
  readonly error = this.secrets.error;
  readonly isFiltered = computed(
    () => this.debouncedSearch.value().trim().length > 0 || this.selectedCategories().length > 0,
  );

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }
}
