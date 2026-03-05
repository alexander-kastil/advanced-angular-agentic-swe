import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DemoItem } from '../demo-base/demo-item.model';

export const demoActions = createActionGroup({
  source: 'Demos',
  events: {
    loadDemos: emptyProps(),
    loadDemosSuccess: props<{ demos: DemoItem[] }>(),
    loadDemosFailure: props<{ err: Error }>(),
    addDemo: props<{ demo: DemoItem }>(),
    addDemoSuccess: props<{ demo: DemoItem }>(),
    addDemoFailure: props<{ err: Error }>(),
    updateDemo: props<{ demo: DemoItem }>(),
    updateDemoSuccess: props<{ demo: DemoItem }>(),
    updateDemoFailure: props<{ err: Error }>(),
    deleteDemo: props<{ demo: DemoItem }>(),
    deleteDemoSuccess: props<{ demo: DemoItem }>(),
    deleteDemoFailure: props<{ err: Error }>(),
    setSelected: props<{ demo: DemoItem }>(),
    applyFilter: props<{ filter: string }>(),
    redirectToError: emptyProps(),
  }
});
