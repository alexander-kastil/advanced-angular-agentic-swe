import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CustomersService } from '../customers.service';
import { customersActions } from './customers.actions';

export const loadCustomers = createEffect((actions$ = inject(Actions), service = inject(CustomersService)) => {
  return actions$.pipe(
    ofType(customersActions.loadCustomers),
    mergeMap(() =>
      service.getCustomers().pipe(
        map((customers) =>
          customersActions.loadCustomersSuccess({ customers })
        ),
        catchError((err) => of(customersActions.loadCustomersFailure({ err })))
      )
    )
  )
}, { functional: true });
