import { Component, signal } from '@angular/core';
import { CustomerEditComponent } from '../../../customers/customer-edit/customer-edit.component';
import { Customer } from '../../../customers/customer.model';

@Component({
    selector: 'app-component-input-signals',
    imports: [CustomerEditComponent],
    template: `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Input Signals and Outputs</h2>
        </div>
        <div class="card-content">
          <p>
            The spec sets <code>customer</code> with
            <code>fixture.componentRef.setInput()</code> and listens on the
            <code>save</code> and <code>cancel</code> outputs.
          </p>
          <app-customer-edit
            [customer]="customer()"
            (save)="onSave($event)"
            (cancel)="onCancel()"
          />
          <div data-testid="last-event">Last output: {{ lastEvent() }}</div>
        </div>
      </div>
    `,
})
export class ComponentInputSignalsComponent {
  readonly customer = signal<Customer>({ id: 2, name: 'Giro' });
  readonly lastEvent = signal('none');

  onSave(customer: Customer) {
    this.customer.set(customer);
    this.lastEvent.set('save ' + customer.id + ' - ' + customer.name);
  }

  onCancel() {
    this.lastEvent.set('cancel');
  }
}
