import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LayoutStore } from '../layout/layout.store';

@Injectable({
  providedIn: 'root',
})
export class SideNavService {
  private layoutStore = inject(LayoutStore);
  private breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(
        tap((result) => {
          const position = result.matches ? 'over' : 'side';
          const visible = !result.matches;
          this.layoutStore.setSidenavVisible(visible);
          this.layoutStore.setSidenavPosition(position);
        }),
        takeUntilDestroyed()
      ).subscribe();
  }

  getSideNavVisible() {
    return this.layoutStore.sidenavVisible;
  }

  getSideNavPosition() {
    return this.layoutStore.sidenavPosition;
  }

  toggleMenuVisibility() {
    this.layoutStore.toggleSidenavVisible();
  }
}
