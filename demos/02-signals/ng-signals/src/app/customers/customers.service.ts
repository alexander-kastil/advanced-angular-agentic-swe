import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  readonly customers = httpResource<Customer[]>(() => `${environment.api}customers`, {
    defaultValue: [],
  });
}
