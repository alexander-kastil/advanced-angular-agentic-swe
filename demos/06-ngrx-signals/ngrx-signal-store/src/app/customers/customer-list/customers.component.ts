import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { customersStore } from '../customers.store';
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  imports: [RouterLink, ProgressBarComponent],
})
export class CustomersComponent {
  store = inject(customersStore);
  customers = this.store.customers;
}
