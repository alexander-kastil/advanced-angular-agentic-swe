import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { MarkdownItem } from './markdown.model';
import { MarkdownEditorService } from './markdown-editor.service';
import { withEntities } from '@ngrx/signals/entities';
import { addEntities, removeEntity, setEntity } from '@ngrx/signals/entities';

const logError = (error: Error) => console.error('error: ', error);

export function withMarkdownItems() {
    return signalStoreFeature(
        withEntities<MarkdownItem>(),
        withMethods((store, service = inject(MarkdownEditorService)) => ({
            fetchComments: rxMethod<void>(
                pipe(
                    switchMap(() =>
                        service.getComments().pipe(
                            tapResponse({
                                next: (comments) => patchState(store, addEntities(comments)),
                                error: logError,
                            })
                        )
                    )
                )
            ),
            saveComment: rxMethod<MarkdownItem>(
                pipe(
                    switchMap((item) =>
                        service.saveComment(item).pipe(
                            tapResponse({
                                next: (saved) => patchState(store, setEntity(saved)),
                                error: logError,
                            })
                        )
                    )
                )
            ),
            deleteComment: rxMethod<MarkdownItem>(
                pipe(
                    switchMap((item) =>
                        service.deleteComment(item).pipe(
                            tapResponse({
                                next: () => patchState(store, removeEntity(item.id)),
                                error: logError,
                            })
                        )
                    )
                )
            ),
        }))
    );
}
