import { httpResource } from '@angular/common/http';
import { Injectable, computed } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DemoItem } from './demo-item.model';

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  readonly demosResource = httpResource<DemoItem[]>(() => `${environment.api}demos`, {
    defaultValue: [],
  });

  readonly demos = computed(() =>
    [...this.demosResource.value()].sort((a, b) => a.sortOrder - b.sortOrder)
  );

  readonly isLoading = this.demosResource.isLoading;
  readonly hasError = computed(() => this.demosResource.status() === 'error');
}
