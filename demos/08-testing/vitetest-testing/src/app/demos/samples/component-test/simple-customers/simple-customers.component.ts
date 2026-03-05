import { Component, inject, ChangeDetectionStrategy, resource } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { lastValueFrom } from 'rxjs';
import { Customer } from '../../../../customers/customer.model';
import { CustomersService } from '../../../../customers/customers.service';

@Component({
  selector: 'app-simple-customers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './simple-customers.component.html',
  imports: [MatCardModule, MatButtonModule],
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
