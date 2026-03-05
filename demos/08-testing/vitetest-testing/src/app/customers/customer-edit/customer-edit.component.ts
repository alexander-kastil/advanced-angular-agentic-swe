import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { form, FormField, required } from '@angular/forms/signals';
import { Customer } from '../customer.model';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  imports: [
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatButtonModule,
    FormField
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
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
