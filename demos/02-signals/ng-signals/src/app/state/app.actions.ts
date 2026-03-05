import { MatDrawerMode } from '@angular/material/sidenav';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const appActions = createActionGroup({
  source: 'app',
  events: {
    toggleMockAuthenticated: emptyProps(),
    toggleSideNav: emptyProps(),
    changeSideNavPosition: props<{ position: MatDrawerMode }>(),
    changeSideNavVisible: props<{ visible: boolean }>(),
  }
});