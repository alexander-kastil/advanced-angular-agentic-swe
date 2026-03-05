import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { AppStateComponent } from './samples/app-state/app-state.component';
import { ContainerPresenterNgrxComponent } from './samples/container-presenter-ngrx/container-presenter-ngrx.component';
import { CustomStoreFeaturesComponent } from './samples/custom-store-features/custom-store-features.component';
import { DeepSignalComponent } from './samples/deep-signal/deep-signal.component';
import { MarkdownEditorComponent } from './samples/markdown-editor/markdown-editor.component';
import { NgrxInteropComponent } from './samples/ngrx-interop/ngrx-interop.component';
import { StoreCrudComponent } from './samples/store-crud/store-crud.component';
import { StoreEntitiesComponent } from './samples/store-entities/store-entities.component';

export const demoRoutes: Routes = [
  {
    path: '',
    component: DemoContainerComponent,
    children: [
      { path: 'app-state', component: AppStateComponent, title: 'Demos - App State' },
      { path: 'store-crud', component: StoreCrudComponent, title: 'Demos - CRUD withMethods' },
      { path: 'store-entities', component: StoreEntitiesComponent, title: 'Demos - Entities' },
      { path: 'ngrx-interop', component: NgrxInteropComponent, title: 'Demos - NgRx Interop' },
      { path: 'custom-store-features', component: CustomStoreFeaturesComponent, title: 'Demos - Request Status Feature' },
      { path: 'deep-signals', component: DeepSignalComponent, title: 'Demos - Deep Signals' },
      { path: 'presenter-ngrx', component: ContainerPresenterNgrxComponent, title: 'Demos - Container Presenter' },
      { path: 'markdown-editor', component: MarkdownEditorComponent, title: 'Demos - Markdown Editor' },
    ],
  },
];
