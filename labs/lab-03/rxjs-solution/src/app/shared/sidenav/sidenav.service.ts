import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, inject, signal } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SideNavService {
  breakpointObserver = inject(BreakpointObserver);
  sideNavVisible = signal<boolean>(true);
  sideNavPosition = signal<MatDrawerMode>('side');

  constructor() {
    this.watchScreen.subscribe();
  }

  watchScreen = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(
      tap((matchesBreakpoint) => {
        console.log(matchesBreakpoint);
        this.sideNavVisible.set(matchesBreakpoint.matches ? false : true);
        this.sideNavPosition.set(matchesBreakpoint.matches ? 'over' : 'side');
      })
    );

  toggleMenuVisibility() {
    const visible = !this.sideNavVisible();
    this.sideNavVisible.set(visible);
  }
}
