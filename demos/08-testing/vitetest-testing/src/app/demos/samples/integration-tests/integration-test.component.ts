import { Component, signal } from '@angular/core';
import { CustomersTableComponent } from '../../../customers/customers-table/customers-table.component';
import { CustomerEditComponent } from '../../../customers/customer-edit/customer-edit.component';
import { Customer } from '../../../customers/customer.model';

@Component({
    selector: 'app-integration-test',
    templateUrl: './integration-test.component.html',
    styleUrls: ['./integration-test.component.scss'],
    imports: [CustomersTableComponent, CustomerEditComponent],
})
export class IntegrationTestComponent {
    readonly customers = signal<Customer[]>([
        { id: 1, name: 'Soi' },
        { id: 2, name: 'Giro' },
    ]);
    readonly loading = signal(false);
    readonly selectedCustomer = signal<Customer | null>(null);
    readonly events = signal<string[]>([]);

    onEdit(customer: Customer) {
        this.selectedCustomer.set(customer);
        this.log('edit ' + customer.id);
    }

    onDelete(id: number) {
        this.customers.update((list) => list.filter((c) => c.id !== id));
        this.log('delete ' + id);
    }

    onAdd() {
        const nextId = this.customers().reduce((max, c) => (c.id > max ? c.id : max), 0) + 1;
        this.selectedCustomer.set({ id: nextId, name: '' });
        this.log('add ' + nextId);
    }

    onSave(customer: Customer) {
        this.customers.update((list) =>
            list.some((c) => c.id === customer.id)
                ? list.map((c) => (c.id === customer.id ? customer : c))
                : [...list, customer]
        );
        this.selectedCustomer.set(null);
        this.log('save ' + customer.id + ' - ' + customer.name);
    }

    onCancel() {
        this.selectedCustomer.set(null);
        this.log('cancel');
    }

    private log(entry: string) {
        this.events.update((list) => [entry, ...list].slice(0, 6));
    }
}
