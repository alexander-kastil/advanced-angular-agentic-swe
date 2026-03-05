import {
  createEntityAdapter,
  EntityAdapter,
  EntityState,
  Update,
} from '@ngrx/entity';
import { createFeature, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { DemoItem } from '../demo-container/demo-item.model';
import { demoActions } from './demos.actions';


// State
export const demosFeatureKey = 'demos';

// internal entity structure
// interface EntityState<T> {
//   ids: string[];
//   entities: { [id: string]: T };
// }

export interface DemoState extends EntityState<DemoItem> {
  loaded: boolean;
  selected: DemoItem;
  filter: string;
}

export const demosAdapter: EntityAdapter<DemoItem> =
  createEntityAdapter<DemoItem>();

export const defaultDemoItemState: DemoState = {
  ids: [],
  entities: {},
  loaded: false,
  filter: '',
  selected: new DemoItem()
};

export const initialState = demosAdapter.getInitialState(defaultDemoItemState);

export const demoState = createFeature({
  name: demosFeatureKey,
  reducer: createReducer(
    initialState,
    on(demoActions.loadDemosSuccess, (state, action) => {
      return demosAdapter.setAll(action.demos, {
        ...state,
        loaded: true,
      });
    }),
    on(demoActions.updateDemoSuccess, (state, action) => {
      const item: Update<DemoItem> = {
        id: action.demo.id,
        changes: { visible: action.demo.visible },
      };
      return demosAdapter.updateOne(item, { ...state });
    }),
    on(demoActions.deleteDemoSuccess, (state, action) => {
      return demosAdapter.removeOne(action.demo.id, {
        ...state,
      });
    }),
    on(demoActions.setSelected, (state, action) => {
      return { ...state, selected: action.demo };
    }),
    on(demoActions.applyFilter, (state, action) => {
      return { ...state, filter: action.filter };
    }),
    on(
      demoActions.updateDemoFailure,
      demoActions.deleteDemoFailure,
      demoActions.loadDemosFailure, (state, action) => {
        return { ...state };
      }))
});

export const { selectAll, selectEntities, selectIds, selectTotal } =
  demosAdapter.getSelectors();

export const getDemoState = createFeatureSelector<DemoState>(demosFeatureKey);

export const selectLoaded = createSelector(getDemoState, (state) => state.loaded);
export const selectSelected = createSelector(getDemoState, (state) => state.selected);
export const selectFilter = createSelector(getDemoState, (state) => state.filter);
export const getAllDemos = createSelector(getDemoState, selectAll);
