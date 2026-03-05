import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SideNavService {
  breakpointObserver = inject(BreakpointObserver);

  visible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  position$: BehaviorSubject<MatDrawerMode> = new BehaviorSubject<MatDrawerMode>('side');

  constructor() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(
        tap((matchesBreakpoint) => {
          console.log(matchesBreakpoint);
          this.visible$.next(matchesBreakpoint.matches ? false : true);
          this.position$.next(matchesBreakpoint.matches ? 'over' : 'side');
        })
      ).subscribe();
  }

  getSideNavVisible() {
    return this.visible$.asObservable();
  }

  getSideNavPosition() {
    return this.position$.asObservable();
  }

  toggleMenuVisibility() {
    let status = !this.visible$.getValue();
    this.visible$.next(status);
  }
}
