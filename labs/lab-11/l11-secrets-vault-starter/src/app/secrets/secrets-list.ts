import { Component, computed, inject, viewChildren } from '@angular/core';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CategoryChips } from './category-chips';
import { SecretMenu } from './secret-menu';
import { SecretRow } from './secret-row';
import { SecretsStore } from '../store/secrets-store';

@Component({
  selector: 'app-secrets-list',
  imports: [
    CategoryChips,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    SecretMenu,
    SecretRow,
  ],
  templateUrl: './secrets-list.html',
  styleUrl: './secrets-list.css',
})
export class SecretsList {
  readonly store = inject(SecretsStore);

  private readonly rowComponents = viewChildren(SecretRow);
  readonly renderedCount = computed(() => this.rowComponents().length);
  readonly loadedCount = computed(() => this.store.secretEntities().length);

  readonly isFiltered = computed(
    () => this.store.search().trim().length > 0 || this.store.selectedCategoryIds().length > 0,
  );

  trackBySecretId(_index: number, secret: { secretId: string }): string {
    return secret.secretId;
  }

  onSearch(event: Event): void {
    this.store.setSearch((event.target as HTMLInputElement).value);
  }
}
