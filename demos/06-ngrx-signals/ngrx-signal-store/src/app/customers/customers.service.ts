import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  http = inject(HttpClient);

  getCustomers() {
    return this.http.get<Customer[]>(environment.api + 'customers');
  }

  updateCustomer(customer: Customer) {
    return this.http.put<Customer>(environment.api + 'customers/' + customer.id, customer);
  }
}
