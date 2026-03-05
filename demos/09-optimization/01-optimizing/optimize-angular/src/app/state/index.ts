import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { appReducer, AppState } from './app.reducer';
import { RouterStateUrl } from './router.reducer';
import { customerReducer, CustomersState } from '../customers/state/customers.reducer';
import { AILoggerService } from '../shared/logging/ailogger.service';

// State
export interface State {
  app: AppState;
  customers: CustomersState;
  routerReducer: RouterReducerState<RouterStateUrl>;
}

export function logNgRX(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    console.log('ngrx logging:', action);
    if (environment.appInsights) {
      const ai = AILoggerService.getInstance()
      ai.trackEvent({ name: 'ngrx logging', properties: { action: action.type, state: state } });

    }
    return reducer(state, action);
  };
}

export const reducers: ActionReducerMap<State> = {
  app: appReducer,
  customers: customerReducer,
  routerReducer: routerReducer,
};

export const metaReducers: MetaReducer<State>[] = environment.logNgRx
  ? [logNgRX]
  : [];

