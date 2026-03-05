import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomersState, customerState } from './customers.state';
import { customersActions } from './customers.actions';

@Injectable({
    providedIn: 'root'
})
export class CustomersFacade {
    store = inject(Store<CustomersState>)

    loadCustomers() {
        this.store.dispatch(customersActions.loadCustomers());
    }

    getCustomers() {
        this.store.select(customerState.selectFilteredUsers);
    }

    setFilter(filter: string) {
        this.store.dispatch(customersActions.setFilter({ filter }));
    }
}