import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DemoService } from '../demo-base/demo.service';
import { demoActions } from './demos.actions';
import { Router } from '@angular/router';

export const loadDemos = createEffect((actions$ = inject(Actions), service = inject(DemoService)) => {
  return actions$.pipe(
    ofType(demoActions.loadDemos),
    mergeMap(() =>
      service.getDemos().pipe(
        map((demos) =>
          demoActions.loadDemosSuccess({ demos })
        ),
        catchError((err) => of(demoActions.loadDemosFailure({ err })))
      )
    )
  )
}, { functional: true });

export const addDemo = createEffect((actions$ = inject(Actions), service = inject(DemoService)) => {
  return actions$.pipe(
    ofType(demoActions.addDemo),
    mergeMap((action) =>
      service.addDemo(action.demo).pipe(
        map((demo) =>
          demoActions.addDemoSuccess({ demo })
        ),
        catchError((err) => of(demoActions.loadDemosFailure({ err })))
      )
    )
  )
}, { functional: true });

export const updateDemo = createEffect((actions$ = inject(Actions), service = inject(DemoService)) => {
  return actions$.pipe(
    ofType(demoActions.updateDemo),
    mergeMap((action) =>
      service.updateDemo(action.demo).pipe(
        map((demo) =>
          demoActions.updateDemoSuccess({ demo })
        ),
        catchError((err) => of(demoActions.updateDemoFailure({ err })))
      )
    )
  )
}, { functional: true });

export const deleteDemo = createEffect((actions$ = inject(Actions), service = inject(DemoService)) => {
  return actions$.pipe(
    ofType(demoActions.deleteDemo),
    mergeMap((action) =>
      service.deleteDemo(action.demo.id).pipe(
        map((demo) =>
          demoActions.deleteDemoSuccess({ demo })
        ),
        catchError((err) => of(demoActions.deleteDemoFailure({ err })))
      )
    )
  )
}, { functional: true });

export const redirectToError = createEffect((actions$ = inject(Actions), router = inject(Router)) => {
  return actions$.pipe(
    ofType(demoActions.redirectToError),
    mergeMap(() => {
      router.navigate(['/error']);
      return EMPTY.pipe(
        map(() => ({ type: 'Redirected to Error' }))
      );
    })
  )
}, { functional: true });
