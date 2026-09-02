import { Component, input, linkedSignal, output } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { Customer } from '../customer.model';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  imports: [FormField],
})
export class CustomerEditComponent {
  customer = input.required<Customer>();
  save = output<Customer>();
  cancel = output<void>();

  customerModel = linkedSignal(() => ({ ...this.customer() }));

  customerForm = form(this.customerModel, (fieldPath) => {
    required(fieldPath.name, { message: 'Name is required' });
  });

  submit(event: SubmitEvent) {
    event.preventDefault();
    if (this.customerForm().valid()) {
      this.save.emit(this.customerModel());
    }
  }
}
