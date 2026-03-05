import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { customersActions } from '../../../customers/state/customers.actions';
import { CustomersState, customerState } from '../../../customers/state/customers.state';
import { BorderDirective } from '../../../shared/formatting/formatting-directives';

@Component({
  selector: 'app-select-signal',
  imports: [BorderDirective],
  templateUrl: './select-signal.component.html',
  styleUrl: './select-signal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectSignalComponent {
  store = inject(Store) as Store<CustomersState>;
  customers = this.store.selectSignal(customerState.selectCustomers);

  ngOnInit(): void {
    this.store.dispatch(customersActions.loadCustomers());
  }
}
