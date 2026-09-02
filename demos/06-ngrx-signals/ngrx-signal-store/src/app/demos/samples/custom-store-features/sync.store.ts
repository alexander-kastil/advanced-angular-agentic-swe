import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, throwError, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { setError, setFulfilled, setPending, withRequestStatus } from '../../../shared/request-status/request-status.feature';
import { withAttempts } from './with-attempts';

export const SyncStore = signalStore(
  withRequestStatus(),
  withAttempts(),
  withMethods((store) => ({
    sync: rxMethod<boolean>(
      pipe(
        switchMap((shouldFail) => {
          store.countAttempt();
          patchState(store, setPending());
          return timer(800).pipe(
            switchMap(() =>
              shouldFail
                ? throwError(() => new Error('Sync rejected by the server'))
                : timer(0).pipe(map(() => 'synchronized'))
            ),
            tapResponse({
              next: () => patchState(store, setFulfilled()),
              error: (err: Error) => {
                store.countFailure();
                patchState(store, setError(err.message));
              },
            })
          );
        })
      )
    ),
    reset() {
      store.resetAttempts();
      patchState(store, { requestStatus: 'idle' as const });
    },
  }))
);
