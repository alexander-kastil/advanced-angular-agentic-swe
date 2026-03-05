import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Customer } from '../customer.model';

export const customersActions = createActionGroup({
  source: 'Customers',
  events: {
    setFilter: props<{ filter: string }>(),
    loadCustomers: emptyProps(),
    loadCustomersSuccess: props<{ customers: Customer[] }>(),
    loadCustomersFailure: props<{ err: Error }>(),
  }
})
