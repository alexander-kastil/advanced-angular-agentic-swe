import { computed } from '@angular/core';
import { patchState, signalStoreFeature, withComputed, withState } from '@ngrx/signals';

export type LoadingState = {
    isLoading: boolean;
};

export function withLoadingState() {
    return signalStoreFeature(
        withState<LoadingState>({ isLoading: false }),
        withComputed(({ isLoading }) => ({
            isLoading: computed(() => isLoading()),
        }))
    );
}

export function setLoading(isLoading: boolean): LoadingState {
    return { isLoading };
}
