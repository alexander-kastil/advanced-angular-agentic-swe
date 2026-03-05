import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { customersStore } from '../customers.store';
import { CustomersTableComponent } from '../customers-table/customers-table.component';
import { CustomerEditComponent } from '../customer-edit/customer-edit.component';
import { Customer } from '../customer.model';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  imports: [CustomersTableComponent, CustomerEditComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersComponent {
  store = inject(customersStore);

  onEdit(customer: Customer) {
    this.store.selectCustomer(customer);
  }

  onDelete(id: number) {
    this.store.deleteCustomer(id);
  }

  onAdd() {
    const newCustomer: Customer = { id: this.store.nextId(), name: '' };
    this.store.selectCustomer(newCustomer);
  }

  onSave(customer: Customer) {
    if (customer.id === 0 || !this.store.customers().find(c => c.id === customer.id)) {
      this.store.addCustomer(customer);
    } else {
      this.store.updateCustomer(customer);
    }
  }

  onCancel() {
    this.store.selectCustomer(null);
  }
}
