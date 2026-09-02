import { Component, inject, signal } from '@angular/core';
import { Customer } from '../../../customers/customer.model';
import { CustomersService } from '../../../customers/customers.service';
import { environment } from '../../../../environments/environment';

type CallLog = { method: string; url: string; result: string };

@Component({
  selector: 'app-http-tests',
  template: `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">CustomersService over HttpClient</h2>
      </div>
      <div class="card-content">
        <p>Every call below is asserted in the spec with <b>HttpTestingController</b>.</p>
        <div class="actions">
          <button type="button" class="btn btn-primary" (click)="load()">GET customers</button>
          <button type="button" class="btn btn-outline" (click)="add()">POST customer</button>
          <button type="button" class="btn btn-outline" (click)="rename()">PUT customer</button>
          <button type="button" class="btn btn-warn" (click)="remove()">DELETE customer</button>
        </div>

        <div class="endpoints">
          <div>GET {{ api }}customers</div>
          <div>POST {{ api }}customers</div>
          <div>PUT {{ api }}customers/:id</div>
          <div>DELETE {{ api }}customers/:id</div>
        </div>

        @for (c of customers(); track c.id) {
          <div data-testid="customer-row">{{ c.id }} - {{ c.name }}</div>
        }

        @if (log(); as entry) {
          <div class="log" data-testid="log">
            {{ entry.method }} {{ entry.url }} -> {{ entry.result }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .actions { display: flex; flex-wrap: wrap; gap: .5rem; }
    .endpoints { font-family: monospace; }
    .log { font-family: monospace; }
  `],
})
export class HttpTestsComponent {
  private cs = inject(CustomersService);

  readonly api = environment.api;
  readonly customers = signal<Customer[]>([]);
  readonly log = signal<CallLog | null>(null);

  load() {
    this.cs.getCustomers().subscribe({
      next: (list) => {
        this.customers.set(list);
        this.record('GET', 'customers', list.length + ' rows');
      },
      error: (err) => this.record('GET', 'customers', err.message),
    });
  }

  add() {
    this.cs.addCustomer({ id: 0, name: 'NewCustomer' }).subscribe({
      next: (created) => this.record('POST', 'customers', 'created id ' + created.id),
      error: (err) => this.record('POST', 'customers', err.message),
    });
  }

  rename() {
    const first = this.customers()[0];
    if (!first) {
      this.record('PUT', 'customers', 'load customers first');
      return;
    }
    this.cs.updateCustomer({ ...first, name: first.name + ' *' }).subscribe({
      next: (updated) => this.record('PUT', 'customers/' + updated.id, updated.name),
      error: (err) => this.record('PUT', 'customers/' + first.id, err.message),
    });
  }

  remove() {
    const last = this.customers().at(-1);
    if (!last) {
      this.record('DELETE', 'customers', 'load customers first');
      return;
    }
    this.cs.deleteCustomer(last.id).subscribe({
      next: () => this.record('DELETE', 'customers/' + last.id, 'deleted'),
      error: (err) => this.record('DELETE', 'customers/' + last.id, err.message),
    });
  }

  private record(method: string, url: string, result: string) {
    this.log.set({ method, url: this.api + url, result });
  }
}
