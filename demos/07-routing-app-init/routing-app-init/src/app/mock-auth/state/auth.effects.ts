import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { authActions } from './auth.actions';

const redirectToLogin$ = createEffect((actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(ofType(authActions.redirectToLogin), map((action) => {
        router.navigate(['/']);
    }))
}, { dispatch: false });

const redirectFromLogin$ = createEffect((actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(ofType(authActions.redirectFromLogin), map((action) => {
        router.navigate(['/']);
    }))
}, { dispatch: false });