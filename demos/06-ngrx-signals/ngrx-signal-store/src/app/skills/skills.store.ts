import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { addEntity, removeEntity, setEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { setError, setFulfilled, setPending, withRequestStatus } from '../shared/request-status/request-status.feature';
import { Skill } from './skill.model';
import { SkillsService } from './skills.service';

export const SkillsStore = signalStore(
  { providedIn: 'root' },
  withEntities<Skill>(),
  withRequestStatus(),
  withState({ showAll: true }),
  withComputed(({ entities, showAll }) => ({
    visibleSkills: computed(() => {
      const all = [...entities()].sort((a, b) => a.id - b.id);
      return showAll() ? all : all.filter((s) => !s.completed);
    }),
    total: computed(() => entities().length),
    openCount: computed(() => entities().filter((s) => !s.completed).length),
  })),
  withMethods((store, service = inject(SkillsService)) => ({
    load: rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, setPending());
          return service.getSkills().pipe(
            tapResponse({
              next: (skills) => patchState(store, setEntities(skills), setFulfilled()),
              error: (err: Error) => patchState(store, setError(err.message)),
            })
          );
        })
      )
    ),
    add: rxMethod<Skill>(
      pipe(
        switchMap((skill) => {
          patchState(store, setPending());
          return service.addSkill(skill).pipe(
            tapResponse({
              next: (created) => patchState(store, addEntity(created), setFulfilled()),
              error: (err: Error) => patchState(store, setError(err.message)),
            })
          );
        })
      )
    ),
    update: rxMethod<Skill>(
      pipe(
        switchMap((skill) => {
          patchState(store, setPending());
          return service.updateSkill(skill).pipe(
            tapResponse({
              next: (saved) => patchState(store, updateEntity({ id: saved.id, changes: saved }), setFulfilled()),
              error: (err: Error) => patchState(store, setError(err.message)),
            })
          );
        })
      )
    ),
    remove: rxMethod<Skill>(
      pipe(
        switchMap((skill) => {
          patchState(store, setPending());
          return service.deleteSkill(skill).pipe(
            tapResponse({
              next: () => patchState(store, removeEntity(skill.id), setFulfilled()),
              error: (err: Error) => patchState(store, setError(err.message)),
            })
          );
        })
      )
    ),
    toggleShowAll: () => patchState(store, { showAll: !store.showAll() }),
  })),
  withHooks({
    onInit({ load }) {
      load();
    },
  })
);
