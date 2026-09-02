import { Component, input, output } from '@angular/core';
import { Customer } from '../customer.model';
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';

@Component({
  selector: 'app-customers-table',
  imports: [ProgressBarComponent],
  template: `
    <div class="toolbar">
      <button type="button" class="btn btn-primary" (click)="add.emit()">Add Customer</button>
    </div>
    @if (loading()) {
      <app-progress-bar />
    }
    <table class="data-table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (c of customers(); track c.id) {
          <tr>
            <td>{{ c.id }}</td>
            <td>{{ c.name }}</td>
            <td>
              <button
                type="button"
                class="btn-icon"
                [attr.aria-label]="'Edit ' + c.name"
                (click)="edit.emit(c)"
              >
                <span class="icon">edit</span>
              </button>
              <button
                type="button"
                class="btn-icon text-warn hover:text-warn"
                [attr.aria-label]="'Delete ' + c.name"
                (click)="delete.emit(c.id)"
              >
                <span class="icon">delete</span>
              </button>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: [`
    .toolbar { margin-bottom: 1rem; }
  `]
})
export class CustomersTableComponent {
  customers = input.required<Customer[]>();
  loading = input(false);
  edit = output<Customer>();
  delete = output<number>();
  add = output<void>();

  displayedColumns = ['id', 'name', 'actions'];
}
