import { Component, effect, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Customer } from '../customer.model';
import { customersStore } from '../customers.store';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  imports: [ReactiveFormsModule],
})
export class CustomerEditComponent {
  id = input<number>(0);
  store = inject(customersStore);
  customer: Customer | undefined = undefined;

  constructor() {
    effect(() => {
      const id = Number(this.id());
      this.customer = this.store.getById(id);
      if (this.customer) {
        this.customersForm.patchValue(this.customer);
      }
    });
  }

  customersForm = new FormGroup({
    name: new FormControl<string>(this.customer?.name || '', { nonNullable: false }),
    id: new FormControl<number>(this.customer?.id ?? 0, { nonNullable: false }),
  });

  updateCustomer() {
    if (this.customer) {
      const cust = this.customersForm.value as Customer;
      this.store.updateCustomer(cust);
      window.history.back();
    }
  }
}
