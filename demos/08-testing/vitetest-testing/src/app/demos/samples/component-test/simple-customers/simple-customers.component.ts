import { Component, inject, resource } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Customer } from '../../../../customers/customer.model';
import { CustomersService } from '../../../../customers/customers.service';

@Component({
  selector: 'app-simple-customers',
  templateUrl: './simple-customers.component.html',
})
export class SimpleCustomersComponent {
  private cs = inject(CustomersService);

  readonly customers = resource<Customer[], void>({
    loader: () => lastValueFrom(this.cs.getCustomers()),
  });

  deleteCustomer(customer: Customer) {
    this.cs.deleteCustomer(customer.id).subscribe(() => {
      this.customers.reload();
    });
  }
}
