import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { withMarkdownItems } from './with-markdown-items';
import { withLoadingState } from './with-loading-state';

export const markdownEditorStore = signalStore(
    { providedIn: 'root' },
    withLoadingState(),
    withMarkdownItems(),
    withMethods((store) => ({
        setLoading(isLoading: boolean) {
            patchState(store, { isLoading });
        },
    })),
    withHooks({
        onInit({ fetchComments }) {
            fetchComments();
        },
    })
);
