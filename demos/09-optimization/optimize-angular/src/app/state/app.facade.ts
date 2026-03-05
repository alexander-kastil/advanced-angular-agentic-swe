import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './app.reducer';
import { toggleLoggedIn, togglePrimeMember } from './app.actions';
import { getUser, isLoggedIn, isPrimeMember } from './app.selectors';

@Injectable({
  providedIn: 'root',
})
export class AppFacade {
  state = inject(Store<AppState>)

  getIsLoggedIn() {
    return this.state.select(isLoggedIn);
  }

  getPrimeMember() {
    return this.state.select(isPrimeMember);
  }

  getUser() {
    return this.state.select(getUser);
  }

  toggleLoggedIn() {
    this.state.dispatch(toggleLoggedIn());
  }

  togglePrimeMember() {
    this.state.dispatch(togglePrimeMember());
  }
}
