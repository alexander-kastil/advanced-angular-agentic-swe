import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { ControlFlowComponent } from './samples/control-flow/control-flow.component';
import { DeferIdleTimeoutComponent } from './samples/defer-idle-timeout/defer-idle-timeout.component';
import { ContentProjectionComponent } from './samples/content-projection/content-projection.component';
import { DirectiveCompositionComponent } from './samples/directive-composition/directive-composition.component';
import { SignalQueriesComponent } from './samples/signal-queries/signal-queries.component';
import { AriaCompositionComponent } from './samples/aria-composition/aria-composition.component';
import { TemplateVsContainerComponent } from './samples/template-vs-container/template-vs-container.component';
import { HostBindingListenerComponent } from './samples/host-binding-listener/host-binding-listener.component';
import { DynamicComponentsComponent } from './samples/dynamic-components/dynamic-components.component';
import { ResourceApiComponent } from './samples/resource-api/resource-api.component';
import { ResourceWithParamsComponent } from './samples/resource-with-params/resource-with-params.component';
import { AgenticRefactorComponent } from './samples/agentic-refactor/agentic-refactor.component';
import { AntipatternsComponent } from './samples/antipatterns/antipatterns.component';

export const demoRoutes: Routes = [
  {
    path: '',
    component: DemoContainerComponent,
    children: [
      { path: 'control-flow', component: ControlFlowComponent },
      { path: 'defer-idle-timeout', component: DeferIdleTimeoutComponent },
      { path: 'content-projection', component: ContentProjectionComponent },
      { path: 'directive-composition', component: DirectiveCompositionComponent },
      { path: 'signal-queries', component: SignalQueriesComponent },
      { path: 'aria-composition', component: AriaCompositionComponent },
      { path: 'template-vs-container', component: TemplateVsContainerComponent },
      { path: 'host-binding-listener', component: HostBindingListenerComponent },
      { path: 'dynamic-components', component: DynamicComponentsComponent },
      { path: 'resource-api', component: ResourceApiComponent },
      { path: 'resource-with-params', component: ResourceWithParamsComponent },
      { path: 'agentic-refactor', component: AgenticRefactorComponent },
      { path: 'antipatterns', component: AntipatternsComponent },
    ],
  },
];
