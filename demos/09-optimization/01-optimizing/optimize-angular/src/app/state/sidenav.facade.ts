import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import {
    changeSideNavPosition,
    changeSideNavVisible,
    toggleSideNav
} from './app.actions';
import { AppState } from './app.reducer';
import { getSideNavPosition, getSideNavVisible } from './app.selectors';


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
                    this.store.dispatch(changeSideNavVisible({ visible }));
                    this.store.dispatch(changeSideNavPosition({ position }));
                })
            ).subscribe();
    }

    getSideNavVisible() {
        return this.store.select(getSideNavVisible);
    }

    getSideNavPosition() {
        return this.store.select(getSideNavPosition);
    }

    toggleMenuVisibility() {
        this.store.dispatch(toggleSideNav());
    }
}
