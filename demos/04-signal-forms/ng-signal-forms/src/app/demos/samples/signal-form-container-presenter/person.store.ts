import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { Person } from '../person/person.model';
import { PersonService } from '../person/person.service';

type PersonState = {
    persons: Person[];
    selectedPerson: Person | null;
    loading: boolean;
};

const initialState: PersonState = {
    persons: [],
    selectedPerson: null,
    loading: false,
};

export const PersonStore = signalStore(
    withState(initialState),
    withComputed(({ persons }) => ({
        count: computed(() => persons().length),
    })),
    withMethods((store, service = inject(PersonService)) => ({
        loadPersons: rxMethod<void>(
            pipe(
                switchMap(() => {
                    patchState(store, { loading: true });
                    return service.getPersons().pipe(
                        tapResponse({
                            next: (persons) => patchState(store, { persons }),
                            error: (err) => console.error('Error loading persons:', err),
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )
        ),
        selectPerson(person: Person): void {
            patchState(store, { selectedPerson: { ...person } });
        },
        savePerson: rxMethod<Person>(
            pipe(
                switchMap((person) => {
                    patchState(store, { loading: true });
                    return service.savePerson(person).pipe(
                        tapResponse({
                            next: (saved) => {
                                const persons = store.persons().map((p) =>
                                    p.id === saved.id ? { ...p, ...saved } : p
                                );
                                patchState(store, { persons, selectedPerson: null });
                            },
                            error: (err) => console.error('Error saving person:', err),
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )
        ),
    })),
    withHooks({
        onInit({ loadPersons }) {
            loadPersons();
        },
    })
);
