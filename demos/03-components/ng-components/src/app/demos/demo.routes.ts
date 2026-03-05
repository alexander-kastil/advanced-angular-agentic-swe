import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { StandaloneComponent } from './samples/standalone/standalone.component';
import { BootstrapStandaloneComponent } from './samples/bootstrap-standalone/bootstrap-standalone.component';
import { ControlFlowComponent } from './samples/control-flow/control-flow.component';
import { DirectiveCompositionComponent } from './samples/directive-composition/directive-composition.component';
import { ContentProjectionComponent } from './samples/content-projection/content-projection.component';
import { ContentChildComponent } from './samples/content-child/content-child.component';
import { ViewChildComponent } from './samples/view-child/view-child.component';
import { TemplateVsContainerComponent } from './samples/template-vs-container/template-vs-container.component';
import { HostBindingListenerComponent } from './samples/host-binding-listener/host-binding-listener.component';
import { ContainerPresenterComponent } from './samples/container-presenter/container-presenter.component';
import { DynamicComponentsComponent } from './samples/dynamic-components/dynamic-components.component';
import { ResourceApiComponent } from './samples/resource-api/resource-api.component';
import { AntipatternsComponent } from './samples/antipatterns/antipatterns.component';
import { ModernTemplateFeaturesComponent } from './samples/modern-template-features/modern-template-features.component';

export const demoRoutes: Routes = [
  {
    path: '',
    component: DemoContainerComponent,
    children: [
      { path: 'standalone', component: StandaloneComponent },
      {
        path: 'lazy-standalone',
        loadComponent: () =>
          import('./samples/lazy-standalone/lazy-standalone.component').then(
            (c) => c.LazyStandaloneComponent
          ),
      },
      { path: 'standalone-bootstrap', component: BootstrapStandaloneComponent },
      { path: 'control-flow', component: ControlFlowComponent },
      { path: 'directives-composition', component: DirectiveCompositionComponent },
      { path: 'content-projection', component: ContentProjectionComponent },
      { path: 'content-child', component: ContentChildComponent },
      { path: 'view-queries', component: ViewChildComponent },
      { path: 'template-vs-container', component: TemplateVsContainerComponent },
      { path: 'host-binding', component: HostBindingListenerComponent },
      { path: 'container-presenter', component: ContainerPresenterComponent },
      { path: 'dynamic-components', component: DynamicComponentsComponent },
      { path: 'resource-api', component: ResourceApiComponent },
      { path: 'antipatterns', component: AntipatternsComponent },
      { path: 'modern-template-features', component: ModernTemplateFeaturesComponent },
    ],
  },
];