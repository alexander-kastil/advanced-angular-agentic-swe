import { createFeatureSelector, createSelector } from '@ngrx/store';
import { appFeatureKey, AppState } from './app.reducer';

export const getAppState = createFeatureSelector<AppState>(appFeatureKey);

export const isLoggedIn = createSelector(
  getAppState,
  (state: AppState) => state.user.isLoggedIn
);

export const isPrimeMember = createSelector(
  getAppState,
  (state: AppState) => state.user.isPrimeMember
);

export const getUser = createSelector(
  getAppState,
  (state: AppState) => state.user
);

export const getSideNavVisible = createSelector(
  getAppState,
  (state: AppState) => state.sideNavVisible
);

export const getSideNavPosition = createSelector(
  getAppState,
  (state: AppState) => state.sideNavPosition
);
