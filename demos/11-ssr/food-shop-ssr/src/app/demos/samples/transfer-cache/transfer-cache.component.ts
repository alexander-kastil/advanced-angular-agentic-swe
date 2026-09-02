import { afterNextRender, Component, computed, inject, resource, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { CodePanelComponent } from '../../../shared/code-panel/code-panel.component';
import { FoodService } from '../../../food/food.service';
import { FoodItem } from '../../../food/food.model';
import { environment } from '../../../../environments/environment';

interface CatalogSummary {
  dishes: number;
  cheapest: string;
  stock: number;
}

@Component({
  selector: 'app-transfer-cache',
  imports: [CodePanelComponent],
  templateUrl: './transfer-cache.component.html',
  styleUrl: './transfer-cache.component.scss',
})
export class TransferCacheComponent {
  private readonly food = inject(FoodService);

  readonly loaderRuns = signal(0);
  readonly browserRequests = signal<string[]>([]);

  readonly catalog = httpResource<FoodItem[]>(() => `${environment.api}food`);

  readonly summary = resource<CatalogSummary, unknown>({
    id: 'food-summary',
    loader: async () => {
      this.loaderRuns.update((runs) => runs + 1);
      const items = await this.food.getCatalog();
      const cheapest = items.reduce((low, item) => (item.price < low.price ? item : low), items[0]);
      return {
        dishes: items.length,
        cheapest: cheapest ? cheapest.name : 'unknown',
        stock: items.reduce((sum, item) => sum + item.inStock, 0),
      };
    },
  });

  readonly dishes = computed(() => this.catalog.value() ?? []);
  readonly refetched = computed(() => this.browserRequests().length > 0);

  readonly httpSnippet = `readonly catalog = httpResource<FoodItem[]>(() => \`\${environment.api}food\`);`;

  readonly resourceSnippet = `readonly summary = resource<CatalogSummary, unknown>({
  id: 'food-summary',
  loader: async () => summarise(await this.food.getCatalog()),
});`;

  readonly tuning = `provideClientHydration(
  withEventReplay(),
  withHttpTransferCacheOptions({
    includeHeaders: ['x-offline-catalog'],
    includePostRequests: false,
  })
)`;

  constructor() {
    afterNextRender(() => {
      const names = performance
        .getEntriesByType('resource')
        .map((entry) => entry.name)
        .filter((name) => name.includes('/food'));
      this.browserRequests.set(names);
    });
  }

  refetch() {
    this.catalog.reload();
    this.summary.reload();
  }
}
