import { httpResource } from '@angular/common/http';
import { Service, computed } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DemoDb, DemoItem } from './demo-item.model';

@Service()
export class DemoService {
  private readonly db = httpResource<DemoDb>(() => environment.demosPath);

  readonly demos = computed(() =>
    [...(this.db.value()?.demos ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)
  );

  readonly topics = computed(() => {
    const grouped = new Map<string, DemoItem[]>();
    for (const demo of this.demos()) {
      grouped.set(demo.topic, [...(grouped.get(demo.topic) ?? []), demo]);
    }
    return [...grouped].map(([topic, demos]) => ({ topic, demos }));
  });

  readonly isLoading = computed(() => this.db.isLoading());
  readonly hasError = computed(() => this.db.error() !== undefined);

  byUrl(url: string) {
    return this.demos().find((demo) => demo.url === url);
  }
}
