import { MatDrawerMode } from '@angular/material/sidenav';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Customer } from '../customers/customer.model';
import { CustomersActions } from '../customers/state/customers.actions';
import { changeSideNavPosition, changeSideNavVisible, toggleLoggedIn, togglePrimeMember, toggleSideNav } from './app.actions';

export const appFeatureKey = 'app';

export interface AppState extends EntityState<Customer> {
  sideNavVisible: boolean;
  sideNavPosition: MatDrawerMode;
  title: string;
}

export const customerAdapter: EntityAdapter<Customer> =
  createEntityAdapter<Customer>();

export const initialAppState: AppState = customerAdapter.getInitialState({
  title: 'Advanced Angular Development',
  user: {
    name: 'Giro the Galgo',
    isLoggedIn: false,
    isPrimeMember: false
  },
  sideNavVisible: true,
  sideNavPosition: 'side',
});

export const appReducer = createReducer(
  initialAppState,
  on(CustomersActions.loadCustomersSuccess, (state, action) => {
    return customerAdapter.setAll(action.items, { ...state });
  }),
  on(toggleSideNav, (state) => ({
    ...state,
    sideNavVisible: !state.sideNavVisible,
  })),
  on(changeSideNavVisible, (state, action) => ({
    ...state,
    sideNavVisible: action.visible,
  })),
  on(changeSideNavPosition, (state, action) => ({
    ...state,
    sideNavPosition: action.position as MatDrawerMode,
  })),
);
