import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { authActions } from './auth.actions';

export const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXNzYWdlIjoiY292aWQgd2FzIGEgZmFrZSBwYW5kZW15In0.9d9TVPkXkcBj7Lv8cDLOv0XcxgmkAj7uA2aMnzcR9JA';

export interface AuthState {
    user: any;
    token: string | null;
    authEnabled: boolean;
    isPrimeMember: boolean;
}

export const initialState: AuthState = {
    user: null,
    token: fakeToken,
    authEnabled: environment.authEnabled,
    isPrimeMember: false,
};

export const authState = createFeature({
    name: 'auth',
    reducer: createReducer(
        initialState,
        on(authActions.setFakeUserAndToken, (state, action) => {
            return {
                ...state,
                user: action.email,
                token: fakeToken,
            };
        }),
        on(authActions.registerUserSuccess, authActions.logInSuccess,
            (state, action) => ({
                ...state,
                user: action.user,
                token: action.token,
            })),
        on(authActions.logOutComplete, (state) => ({
            ...state,
            user: null,
            token: null,
        })),
        on(authActions.registerUserFailure,
            authActions.logInFailure, (state, action) => {
                console.log('register or logIn error:', action.err);
                return {
                    ...state,
                    user: null,
                    token: null,
                };
            }),
        on(authActions.setUser, (state, action) => {
            return {
                ...state,
                user: action.user,
                token: action.token,
            };
        }),
        on(authActions.toggleLoggedIn, (state) => {
            return {
                ...state,
                user: state.user == null ? 'Giro the galgo' : null,
            };
        }),
        on(authActions.togglePrimeMember, (state) => {
            return {
                ...state,
                isPrimeMember: !state.isPrimeMember,
            };
        }),
    ),
    extraSelectors: ({ selectAuthEnabled, selectUser, selectToken }) => ({
        selectIsAuthenticated: createSelector(
            selectAuthEnabled,
            selectUser,
            (authEnabled, user) => {
                return authEnabled == false || user != null;
            }
        ),
        selectAuthResult: createSelector(selectUser, selectToken,
            (user, token) => {
                return { user, token };
            }),
    })
})