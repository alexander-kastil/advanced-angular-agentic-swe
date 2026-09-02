import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDrawerMode } from '@angular/material/sidenav';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SideNavService {
  private breakpointObserver = inject(BreakpointObserver);

  private readonly handset = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map((state) => state.matches)),
    { initialValue: false }
  );

  readonly visible = signal(true);
  readonly position = computed<MatDrawerMode>(() => (this.handset() ? 'over' : 'side'));

  constructor() {
    effect(() => this.visible.set(!this.handset()));
  }

  toggleMenuVisibility() {
    this.visible.update((visible) => !visible);
  }
}
