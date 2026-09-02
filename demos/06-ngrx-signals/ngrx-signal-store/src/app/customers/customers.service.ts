import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private http = inject(HttpClient);
  private url = `${environment.api}customers`;

  getCustomers() {
    return this.http.get<Customer[]>(this.url);
  }

  addCustomer(customer: Customer) {
    const { id: _id, ...payload } = customer;
    return this.http.post<Customer>(this.url, payload);
  }

  updateCustomer(customer: Customer) {
    return this.http.put<Customer>(`${this.url}/${customer.id}`, customer);
  }

  deleteCustomer(customer: Customer) {
    return this.http.delete<unknown>(`${this.url}/${customer.id}`);
  }
}
