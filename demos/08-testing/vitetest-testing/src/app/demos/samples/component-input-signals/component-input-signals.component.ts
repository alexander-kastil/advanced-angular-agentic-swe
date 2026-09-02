import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CustomerEditComponent } from '../../../customers/customer-edit/customer-edit.component';
import { Customer } from '../../../customers/customer.model';

@Component({
    selector: 'app-component-input-signals',
    imports: [MatCardModule, CustomerEditComponent],
    template: `
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>Input Signals and Outputs</mat-card-title>
        </mat-card-header>
        <mat-card-content>
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
        </mat-card-content>
      </mat-card>
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
