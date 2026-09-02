import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CustomersTableComponent } from '../../../customers/customers-table/customers-table.component';
import { CustomerEditComponent } from '../../../customers/customer-edit/customer-edit.component';
import { Customer } from '../../../customers/customer.model';

@Component({
    selector: 'app-integration-test',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './integration-test.component.html',
    styleUrls: ['./integration-test.component.scss'],
    imports: [CustomersTableComponent, CustomerEditComponent],
})
export class IntegrationTestComponent {
    customers = signal<Customer[]>([
        { id: 1, name: 'Soi' },
        { id: 2, name: 'Giro' },
    ]);
    loading = signal(false);
    selectedCustomer = signal<Customer | null>(null);

    onEdit(customer: Customer) {
        this.selectedCustomer.set(customer);
    }

    onCancel() {
        this.selectedCustomer.set(null);
    }
}
