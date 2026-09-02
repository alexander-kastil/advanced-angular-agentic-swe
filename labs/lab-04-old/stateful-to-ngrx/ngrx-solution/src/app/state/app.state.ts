import { createFeature, createReducer, on } from '@ngrx/store';
import { appActions } from './app.actions';
import { MatDrawerMode } from '@angular/material/sidenav';

export interface AppState {
  sideNavVisible: boolean;
  sideNavPosition: MatDrawerMode;
}

export const initialAppState: AppState = {
  sideNavVisible: true,
  sideNavPosition: 'side'
};

export const appState = createFeature({
  name: 'app',
  reducer: createReducer(
    initialAppState,
    on(appActions.toggleSideNav, (state) => ({
      ...state,
      sideNavVisible: !state.sideNavVisible,
    })),
    on(appActions.changeSideNavVisible, (state, action) => ({
      ...state,
      sideNavVisible: action.visible
    })),
    on(appActions.changeSideNavPosition, (state, action) => ({
      ...state,
      sideNavPosition: action.position as MatDrawerMode,
    }))
  )
})
