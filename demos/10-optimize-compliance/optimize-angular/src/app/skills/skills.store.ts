import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { Skill } from './skill.model';
import { pipe, switchMap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { SkillsService } from './skills.service';

type SkillsState = {
    skills: Skill[];
    loading: boolean;
    filter: string;
}

const initialSkillsState: SkillsState = {
    skills: [],
    loading: false,
    filter: '',
};

const logError = (error: Error) => console.error('error: ', error);

export const skillsStore = signalStore(
    { providedIn: 'root', protectedState: false },
    withState(initialSkillsState),
    withMethods((store, service = inject(SkillsService)) => ({
        fetchSkills: rxMethod<void>(
            pipe(
                switchMap(() => {
                    patchState(store, { loading: true });
                    return service.getSkills().pipe(
                        tapResponse({
                            next: (skills) => patchState(store, { skills: skills.sort((a, b) => a.id - b.id) }),
                            error: logError,
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )),
        addSkill: rxMethod<Skill>(
            pipe(
                switchMap((skill) => {
                    patchState(store, { loading: true });
                    return service.addSkill(skill).pipe(
                        tapResponse({
                            next: (added) => patchState(store, { skills: [...store.skills(), added].sort((a, b) => a.id - b.id) }),
                            error: logError,
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )),
        updateSkill: rxMethod<Skill>(
            pipe(
                switchMap((skill) => {
                    patchState(store, { loading: true });
                    return service.addSkill({ ...skill }).pipe(
                        tapResponse({
                            next: (updated) => {
                                const allSkills = [...store.skills()];
                                const index = allSkills.findIndex(s => s.id === updated.id);
                                allSkills[index] = updated;
                                patchState(store, { skills: allSkills });
                            },
                            error: logError,
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )),
        deleteSkill: rxMethod<Skill>(
            pipe(
                switchMap((skill) => {
                    patchState(store, { loading: true });
                    return service.deleteSkill(skill).pipe(
                        tapResponse({
                            next: () => patchState(store, { skills: store.skills().filter(s => s.id !== skill.id) }),
                            error: logError,
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )),
        getById: (id: number) => store.skills().find(s => s.id === id),
    })),
    withComputed((store) => ({
        count: computed(() => store.skills().length),
        notCompleted: computed(() => store.skills().filter(s => !s.completed).length),
    })),
    withHooks({
        onInit({ fetchSkills }) {
            fetchSkills();
        },
    })
);
