import { createFeature, createReducer, on } from '@ngrx/store';
import { MatDrawerMode } from '@angular/material/sidenav';
import { appActions } from './app.actions';

export interface AppState {
  IsMockAuthenticated: boolean;
  sideNavVisible: boolean;
  sideNavPosition: MatDrawerMode;
}

export const initialAppState: AppState = {
  IsMockAuthenticated: false,
  sideNavVisible: true,
  sideNavPosition: 'side',
};

export const appState = createFeature({
  name: 'app',
  reducer: createReducer(initialAppState,
    on(appActions.toggleSideNav, (state) => ({
      ...state,
      sideNavVisible: !state.sideNavVisible,
    })),
    on(appActions.changeSideNavVisible, (state, action) => ({
      ...state,
      sideNavVisible: action.visible,
    })),
    on(appActions.changeSideNavPosition, (state, action) => ({
      ...state,
      sideNavPosition: action.position as MatDrawerMode,
    })),
    on(appActions.toggleMockAuthenticated, (state, action) => ({
      ...state, IsMockAuthenticated: !state.IsMockAuthenticated
    }))
  )
})
