import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { customersActions } from '../customers/state/customers.actions';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppInitService {
  store = inject(Store);
  http = inject(HttpClient);

  loadData() {
    // This is where you would load data from a server or other source
    this.http.get('https://jsonplaceholder.typicode.com/users').subscribe((data) => {
      console.log(data);
    });

    // This is where you would dispatch an action to load data from the store
    this.store.dispatch(customersActions.loadCustomers());
    console.log("dispatched loadCustomers")
  }
}
