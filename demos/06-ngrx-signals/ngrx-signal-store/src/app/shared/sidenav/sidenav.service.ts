import { DestroyRef, Injectable, inject } from '@angular/core';
import { LayoutStore } from '../layout/layout.store';

@Injectable({
  providedIn: 'root',
})
export class SideNavService {
  private layoutStore = inject(LayoutStore);

  constructor() {
    if (typeof window.matchMedia !== 'function') {
      return;
    }
    const query = window.matchMedia('(max-width: 959.98px)');
    const apply = (matches: boolean) => {
      this.layoutStore.setSidenavVisible(!matches);
      this.layoutStore.setSidenavPosition(matches ? 'over' : 'side');
    };
    const listener = (event: MediaQueryListEvent) => apply(event.matches);
    query.addEventListener('change', listener);
    inject(DestroyRef).onDestroy(() => query.removeEventListener('change', listener));
    apply(query.matches);
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
