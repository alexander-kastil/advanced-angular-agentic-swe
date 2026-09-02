import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { httpResource } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDrawerMode } from '@angular/material/sidenav';
import { environment } from '../../../environments/environment';
import { NavItem } from '../navbar/navitem.model';

@Injectable({
  providedIn: 'root',
})
export class SideNavService {
  private breakpointObserver = inject(BreakpointObserver);
  private visible = signal(true);
  private position = signal<MatDrawerMode>('side');

  readonly sideNavVisible = this.visible.asReadonly();
  readonly sideNavPosition = this.position.asReadonly();

  private topItems = httpResource<NavItem[]>(() => `${environment.api}top-links`, {
    defaultValue: [],
  });

  private breakpoint = toSignal(
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
  );

  constructor() {
    effect(() => {
      const state = this.breakpoint();
      if (state) {
        this.visible.set(!state.matches);
        this.position.set(state.matches ? 'over' : 'side');
      }
    });
  }

  getSideNavVisible() {
    return this.sideNavVisible;
  }

  getSideNavPosition() {
    return this.sideNavPosition;
  }

  setSideNavEnabled(val: boolean) {
    this.visible.set(val);
  }

  toggleMenuVisibility() {
    this.visible.update((v) => !v);
  }

  getTopItems() {
    return this.topItems.value;
  }
}
