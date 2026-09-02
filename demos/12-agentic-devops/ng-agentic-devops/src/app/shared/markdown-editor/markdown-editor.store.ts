import { inject } from '@angular/core';
import { signalStore, withHooks } from '@ngrx/signals';
import { addEntities, removeEntity, setEntity } from '@ngrx/signals/entities';
import { Dispatcher, Events, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { mapResponse } from '@ngrx/operators';
import { exhaustMap, switchMap } from 'rxjs';
import { withMarkdownItems } from './with-markdown-items';
import { withRequestState } from './with-loading-state';
import { MarkdownEditorService } from './markdown-editor.service';
import { mdEditorEvents } from './markdown-editor.events';

export const markdownEditorStore = signalStore(
    { providedIn: 'root' },
    withRequestState(),
    withMarkdownItems(),
    withReducer(
        on(mdEditorEvents.fetch, mdEditorEvents.save, mdEditorEvents.delete, () =>
            ({ isLoading: true, error: null as string | null })
        ),
        on(mdEditorEvents.fetchSuccess, ({ payload }) =>
            [addEntities(payload), { isLoading: false }]
        ),
        on(mdEditorEvents.saveSuccess, ({ payload }) =>
            [setEntity(payload), { isLoading: false }]
        ),
        on(mdEditorEvents.deleteSuccess, ({ payload }) =>
            [removeEntity(payload), { isLoading: false }]
        ),
        on(mdEditorEvents.fetchFailed, mdEditorEvents.saveFailed, mdEditorEvents.deleteFailed, ({ payload }) =>
            ({ isLoading: false, error: payload })
        ),
        on(mdEditorEvents.loadContent, () =>
            ({ markdownContent: null as string | null })
        ),
        on(mdEditorEvents.loadContentSuccess, ({ payload }) =>
            ({ markdownContent: payload })
        ),
        on(mdEditorEvents.loadContentFailed, ({ payload }) =>
            ({ error: payload, markdownContent: null as string | null })
        ),
    ),
    withEventHandlers((_, events = inject(Events), service = inject(MarkdownEditorService)) => ({
        loadItems$: events.on(mdEditorEvents.fetch).pipe(
            exhaustMap(() =>
                service.getMarkdownItems().pipe(
                    mapResponse({
                        next: (items) => mdEditorEvents.fetchSuccess(items),
                        error: (err: Error) => mdEditorEvents.fetchFailed(err.message),
                    }),
                ),
            ),
        ),
        saveItem$: events.on(mdEditorEvents.save).pipe(
            exhaustMap(({ payload }) =>
                service.saveMarkdownItem(payload).pipe(
                    mapResponse({
                        next: (saved) => mdEditorEvents.saveSuccess(saved),
                        error: (err: Error) => mdEditorEvents.saveFailed(err.message),
                    }),
                ),
            ),
        ),
        deleteItem$: events.on(mdEditorEvents.delete).pipe(
            exhaustMap(({ payload }) =>
                service.deleteMarkdownItem(payload).pipe(
                    mapResponse({
                        next: () => mdEditorEvents.deleteSuccess(payload.id),
                        error: (err: Error) => mdEditorEvents.deleteFailed(err.message),
                    }),
                ),
            ),
        ),
        loadContent$: events.on(mdEditorEvents.loadContent).pipe(
            switchMap(({ payload }) =>
                service.getMarkdownContent(payload).pipe(
                    mapResponse({
                        next: (content) => mdEditorEvents.loadContentSuccess(content),
                        error: (err: Error) => mdEditorEvents.loadContentFailed(err.message),
                    }),
                ),
            ),
        ),
    })),
    withHooks({
        onInit(_, dispatcher = inject(Dispatcher)) {
            dispatcher.dispatch(mdEditorEvents.fetch());
        },
    })
);
