import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Customer } from '../customer.model';
import { customersActions } from './customers.actions';

export interface CustomersState {
  customers: Customer[];
  filter: string;
}

export const initialAppState: CustomersState = {
  customers: [],
  filter: '',
};

export const customerState = createFeature({
  name: 'customers',
  reducer: createReducer(initialAppState,
    on(customersActions.loadCustomersSuccess, (state, action) => ({
      ...state,
      customers: action.customers,
    })),
    on(customersActions.loadCustomersFailure, (state, action) => ({
      ...state,
    })),
    on(customersActions.setFilter, (state, action) => ({
      ...state,
      filter: action.filter,
    })),
  ),
  extraSelectors: ({ selectCustomers, selectFilter }) => ({
    selectFilteredUsers: createSelector(
      selectCustomers,
      selectFilter,
      (customers, filter) => filter == '' ? customers : customers.filter(customer => customer.name.toLowerCase().includes(filter.toLowerCase())
      )),
  }),
});