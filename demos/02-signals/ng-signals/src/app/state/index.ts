import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { AppState, appState } from './app.state';

export interface State {
  app: AppState;
}

export const reducers: ActionReducerMap<State> = {
  app: appState.reducer
};

export const metaReducers: MetaReducer<State>[] = [];
