import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Customer } from '../../customer.model';
import { customersActions } from '../../state/customers.actions';
import { customerState } from '../../state/customers.state';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, RouterLink]
})
export class CustomersComponent implements OnInit {
  state = inject(Store);
  customers: Customer[] = [];

  ngOnInit(): void {
    this.state.dispatch(customersActions.loadCustomers());
    this.state.select(customerState.selectCustomers).subscribe((customer: Customer[]) => this.customers = customer);
  }
}
