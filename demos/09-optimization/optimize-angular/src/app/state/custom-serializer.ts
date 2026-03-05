import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';
import { Injectable } from '@angular/core';
import { RouterStateUrl } from './router.reducer';

@Injectable()
export class CustomRouterSerializer
  implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const { queryParams } = routerState.root;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }

    const comp =
      state.component != null
        ? state.component
            .toString()
            .substring(6, state.component.toString().indexOf('{') - 1)
        : '';

    const { params } = state;

    return { url, queryParams, params, component: comp };
  }
}
