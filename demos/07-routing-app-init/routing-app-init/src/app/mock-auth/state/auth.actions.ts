import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginCredentials } from '../credential.model';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    registerUser: props<{ credentials: LoginCredentials }>(),
    registerUserSuccess: props<{ user: any, token: string }>(),
    registerUserFailure: props<{ err: Error }>(),
    logIn: props<{ username: string, password: string }>(),
    logInSuccess: props<{ user: any, token: string }>(),
    logInFailure: props<{ err: Error }>(),
    logOut: emptyProps(),
    logOutComplete: emptyProps(),
    setUser: props<{ user: any; token: string }>(),
    redirectToLogin: emptyProps(),
    redirectFromLogin: emptyProps(),
    redirectToError: emptyProps(),
    redirectToRegister: emptyProps(),
    togglePrimeMember: emptyProps(),
    toggleLoggedIn: emptyProps(),
    setFakeUserAndToken: props<{ email: string, token: string }>(),
  }
});