import { computed } from '@angular/core';
import { patchState, signalStoreFeature, withComputed, withMethods, withState } from '@ngrx/signals';

export type AttemptsState = {
  attempts: number;
  failures: number;
};

export function withAttempts() {
  return signalStoreFeature(
    withState<AttemptsState>({ attempts: 0, failures: 0 }),
    withComputed(({ attempts, failures }) => ({
      successRate: computed(() => (attempts() === 0 ? 0 : Math.round(((attempts() - failures()) / attempts()) * 100))),
    })),
    withMethods((store) => ({
      countAttempt() {
        patchState(store, { attempts: store.attempts() + 1 });
      },
      countFailure() {
        patchState(store, { failures: store.failures() + 1 });
      },
      resetAttempts() {
        patchState(store, { attempts: 0, failures: 0 });
      },
    }))
  );
}
