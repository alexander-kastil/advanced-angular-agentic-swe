import { createAction, props } from '@ngrx/store';

export const toggleLoggedIn = createAction('[App] toggleLoggedIn');

export const togglePrimeMember = createAction('[App] togglePrimeMember');

export const toggleSideNav = createAction('[Menu] toggleSideNavVisible');

export const changeSideNavVisible = createAction(
  '[Menu] changeSideNavVisible',
  props<{ visible: boolean }>()
);

export const changeSideNavPosition = createAction(
  '[Menu] changeSideNavPosition',
  props<{ position: string }>()
);
