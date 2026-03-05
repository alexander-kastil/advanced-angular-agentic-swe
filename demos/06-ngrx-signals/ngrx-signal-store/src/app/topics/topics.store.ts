import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { setEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { setFulfilled, setPending, withRequestStatus } from '../shared/request-status/request-status.feature';
import { Topic } from './topic.model';
import { TopicsService } from './topics.service';

const logError = (error: Error) => console.error("error: ", error);

export const topicsStore = signalStore(
    withEntities<Topic>(),
    withRequestStatus(),
    withMethods((store, service = inject(TopicsService)) => ({
        fetchTopics: rxMethod<void>(
            pipe(
                switchMap(() => {
                    patchState(store, setPending());
                    return service.getTopics().pipe(
                        tapResponse({
                            next: (topics) => patchState(store, setEntities(topics)),
                            error: logError,
                            finalize: () => patchState(store, setFulfilled()),
                        })
                    );
                })
            )),
        updateTopic: (topic: Topic) => {
            patchState(store, setPending());
            service.updateTopic(topic).subscribe((updatedTopic) => {
                patchState(store, updateEntity({ id: updatedTopic.id, changes: updatedTopic }));
                patchState(store, setFulfilled())
            }
            );
        },
    })),
    withHooks({
        onInit({ fetchTopics }) {
            fetchTopics();
        },
    })
)