import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { AppStateComponent } from './samples/app-state/app-state.component';
import { ClassicToSignalStoreComponent } from './samples/classic-to-signalstore/classic-to-signalstore.component';
import { CustomStoreFeaturesComponent } from './samples/custom-store-features/custom-store-features.component';
import { DeepSignalComponent } from './samples/deep-signals/deep-signals.component';
import { LinkedStateComponent } from './samples/linked-state/linked-state.component';
import { MarkdownEditorComponent } from './samples/markdown-editor/markdown-editor.component';
import { SkillsEntitiesComponent } from './samples/skills-entities/skills-entities.component';
import { StoreCompositionComponent } from './samples/store-composition/store-composition.component';
import { StoreCrudComponent } from './samples/store-crud/store-crud.component';
import { StoreEntitiesComponent } from './samples/store-entities/store-entities.component';
import { StoreEventsComponent } from './samples/store-events/store-events.component';
import { StoreResourceComponent } from './samples/store-resource/store-resource.component';
import { WebmcpStoreComponent } from './samples/webmcp-store/webmcp-store.component';

export const demoRoutes: Routes = [
  {
    path: '',
    component: DemoContainerComponent,
    children: [
      { path: 'app-state', component: AppStateComponent, title: 'Demos - App State' },
      { path: 'store-crud', component: StoreCrudComponent, title: 'Demos - CRUD withMethods' },
      { path: 'deep-signals', component: DeepSignalComponent, title: 'Demos - Deep Signals' },
      { path: 'linked-state', component: LinkedStateComponent, title: 'Demos - Linked State' },
      { path: 'store-entities', component: StoreEntitiesComponent, title: 'Demos - Entities' },
      { path: 'skills-entities', component: SkillsEntitiesComponent, title: 'Demos - Skills Entities' },
      { path: 'store-resource', component: StoreResourceComponent, title: 'Demos - Resource Extensions' },
      { path: 'custom-store-features', component: CustomStoreFeaturesComponent, title: 'Demos - Request Status Feature' },
      { path: 'store-events', component: StoreEventsComponent, title: 'Demos - Event-Based Store' },
      { path: 'markdown-editor', component: MarkdownEditorComponent, title: 'Demos - Markdown Editor' },
      { path: 'store-composition', component: StoreCompositionComponent, title: 'Demos - Store Composition' },
      { path: 'webmcp-store', component: WebmcpStoreComponent, title: 'Demos - WebMCP Store' },
      { path: 'classic-to-signalstore', component: ClassicToSignalStoreComponent, title: 'Demos - Classic to SignalStore' },
    ],
  },
];
