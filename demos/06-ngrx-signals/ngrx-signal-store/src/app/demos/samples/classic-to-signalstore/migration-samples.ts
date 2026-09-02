export const classicSample = `// skills.actions.ts
export const loadSkills = createAction('[Skills] Load');
export const loadSkillsSuccess = createAction('[Skills] Load Success', props<{ skills: Skill[] }>());
export const loadSkillsFailure = createAction('[Skills] Load Failure', props<{ error: string }>());

// skills.reducer.ts
export interface SkillsState extends EntityState<Skill> {
  loading: boolean;
  error: string | null;
}

const adapter = createEntityAdapter<Skill>();

export const skillsReducer = createReducer(
  adapter.getInitialState({ loading: false, error: null }),
  on(loadSkills, (state) => ({ ...state, loading: true, error: null })),
  on(loadSkillsSuccess, (state, { skills }) => adapter.setAll(skills, { ...state, loading: false })),
  on(loadSkillsFailure, (state, { error }) => ({ ...state, loading: false, error }))
);

// skills.selectors.ts
export const selectSkillsState = createFeatureSelector<SkillsState>('skills');
export const selectAllSkills = createSelector(selectSkillsState, adapter.getSelectors().selectAll);
export const selectLoading = createSelector(selectSkillsState, (s) => s.loading);

// skills.effects.ts
export class SkillsEffects {
  private actions = inject(Actions);
  private service = inject(SkillsService);

  load = createEffect(() =>
    this.actions.pipe(
      ofType(loadSkills),
      switchMap(() =>
        this.service.getAll().pipe(
          map((skills) => loadSkillsSuccess({ skills })),
          catchError((err) => of(loadSkillsFailure({ error: err.message })))
        )
      )
    )
  );
}

// skills.component.ts
export class SkillsComponent {
  private store = inject(Store);
  skills$ = this.store.select(selectAllSkills);
  loading$ = this.store.select(selectLoading);

  ngOnInit() {
    this.store.dispatch(loadSkills());
  }
}`;

export const signalStoreSample = `// skills.store.ts
export const SkillsStore = signalStore(
  { providedIn: 'root' },
  withEntities<Skill>(),
  withRequestStatus(),
  withMethods((store, service = inject(SkillsService)) => ({
    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, setPending())),
        switchMap(() =>
          service.getAll().pipe(
            tapResponse({
              next: (skills) => patchState(store, setAllEntities(skills), setFulfilled()),
              error: (err: Error) => patchState(store, setError(err.message)),
            })
          )
        )
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.load();
    },
  })
);

// skills.component.ts
export class SkillsComponent {
  protected store = inject(SkillsStore);
}`;

export const migrationPrompt = `Migrate the classic NgRx feature under src/app/skills to @ngrx/signals.

Read first, then plan:
1. List every action, reducer case, selector and effect in the feature, and the components that consume them.
2. Report that list back before you write code. Do not start until I confirm it.

Rules for the migration:
- One signalStore replaces the actions, reducer, selectors and effects of the feature.
- The entity collection uses withEntities. Do not hand-roll ids plus an entities record.
- loading and error collapse into the existing withRequestStatus() feature in src/app/shared/request-status.
- Effects become rxMethod with tapResponse from @ngrx/operators, preserving the original flattening
  operator (switchMap stays switchMap, concatMap stays concatMap).
- Selectors become withComputed members on the store.
- Components inject the store and read signals. No async pipe over a store observable, no subscribe.
- Scope the store the way the feature was scoped: providedIn root for shared state, component providers otherwise.
- Delete the migrated action, reducer, selector and effect files, and drop @ngrx/store, @ngrx/effects,
  @ngrx/entity and @ngrx/data from package.json once nothing imports them.

Verify before reporting done:
- grep the repo for every deleted symbol and show me zero hits.
- run npm run build and npm test and paste the output.`;
