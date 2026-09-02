import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Customer } from '../../../customers/customer.model';

@Injectable({ providedIn: 'root' })
export class UnstableApiService {
  private readonly http = inject(HttpClient);

  load() {
    return this.http.get<Customer[]>(`${environment.api}customers`);
  }

  loadOne(id: number) {
    return this.http.get<Customer>(`${environment.api}customers/${id}`);
  }

  save(customer: Customer) {
    return this.http.put<Customer>(`${environment.api}customers/${customer.id}`, customer);
  }
}
