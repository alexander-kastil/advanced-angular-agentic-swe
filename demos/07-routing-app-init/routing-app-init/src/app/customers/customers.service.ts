import { httpResource } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  readonly filter = signal('');

  readonly customersResource = httpResource<Customer[]>(
    () => `${environment.api}customers`,
    { defaultValue: [] }
  );

  readonly customers = computed(() => {
    const term = this.filter().toLowerCase();
    const all = this.customersResource.value();
    return term === ''
      ? all
      : all.filter((customer) => customer.name.toLowerCase().includes(term));
  });

  setFilter(filter: string) {
    this.filter.set(filter);
  }
}
