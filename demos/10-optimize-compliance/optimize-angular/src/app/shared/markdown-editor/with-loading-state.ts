import { signalStoreFeature, withState } from '@ngrx/signals';

export type RequestState = {
    isLoading: boolean;
    error: string | null;
    markdownContent: string | null;
};

export function withRequestState() {
    return signalStoreFeature(
        withState<RequestState>({ isLoading: false, error: null, markdownContent: null })
    );
}
