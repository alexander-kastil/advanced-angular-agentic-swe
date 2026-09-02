import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { Customer } from '../../../customers/customer.model';
import { customersStore } from '../../../customers/customers.store';

@Component({
  selector: 'app-store-crud',
  imports: [FormsModule, ProgressBarComponent],
  templateUrl: './store-crud.component.html',
  styleUrl: './store-crud.component.scss',
})
export class StoreCrudComponent {
  protected store = inject(customersStore);
  protected newName = signal('');
  protected editing = signal<Customer | null>(null);

  add() {
    const name = this.newName().trim();
    if (!name) return;
    this.store.addCustomer({ id: this.store.nextId(), name });
    this.newName.set('');
  }

  startEdit(customer: Customer) {
    this.editing.set({ ...customer });
  }

  saveEdit() {
    const customer = this.editing();
    if (!customer || !customer.name.trim()) return;
    this.store.updateCustomer(customer);
    this.editing.set(null);
  }

  rename(name: string) {
    const customer = this.editing();
    if (customer) this.editing.set({ ...customer, name });
  }

  remove(customer: Customer) {
    this.store.deleteCustomer(customer);
  }
}
