import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { appActions } from './app.actions';
import { AppState, appState } from './app.state';

@Injectable({
  providedIn: 'root',
})
export class SideNavFacade {
  breakpointObserver = inject(BreakpointObserver);
  store = inject(Store<AppState>);

  constructor() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(
        tap((matchesBreakpoints) => {
          console.log("matchesBreakpoint: ", matchesBreakpoints.matches);
          const position = matchesBreakpoints.matches ? 'over' : 'side';
          const visible = matchesBreakpoints.matches ? false : true;
          this.store.dispatch(appActions.changeSideNavVisible({ visible }));
          this.store.dispatch(appActions.changeSideNavPosition({ position }));
        })
      ).subscribe();
  }

  getSideNavVisible() {
    return this.store.select(appState.selectSideNavVisible);
  }

  getSideNavPosition() {
    return this.store.select(appState.selectSideNavPosition);
  }

  toggleMenuVisibility() {
    this.store.dispatch(appActions.toggleSideNav());
  }
}
