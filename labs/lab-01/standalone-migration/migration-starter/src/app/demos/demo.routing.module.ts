import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { ActionStreamsComponent } from './samples/action-streams/action-streams.component';
import { BootstrapStandaloneComponent } from './samples/bootstrap-standalone/bootstrap-standalone.component';
import { ContentChildComponent } from './samples/content-child/content-child.component';
import { ControlValueAccessorComponent } from './samples/control-value-accessor/control-value-accessor.component';
import { FormArrayComponent } from './samples/form-array/form-array.component';
import { FormControlComponent } from './samples/form-control/form-control.component';
import { FormBuilderComponent } from './samples/forms-builder/forms-builder.component';
import { GetRawValueComponent } from './samples/get-raw-value/get-raw-value.component';
import { HostBindingListenerComponent } from './samples/host-binding-listener/host-binding-listener.component';
import { ReactiveCascadeComponent } from './samples/cascade/reactive-cascade.component';
import { ReactiveExplicitTypedComponent } from './samples/explicit-typed/reactive-explicit-typed.component';
import { ReactiveFormsComponent } from './samples/reactive-forms/reactive-forms.component';
import { ReactiveNestedComponent } from './samples/nested-objects/reactive-nested.component';
import { ReactiveTypedValidationComponent } from './samples/validaton-intro/reactive-typed-validaton.component';
import { ReactiveTypedComponent } from './samples/typed/reactive-typed.component';
import { ReactiveValidationComponent } from './samples/state-validators/reactive-validation.component';
import { StandaloneComponent } from './samples/standalone/standalone.component';
import { TemplateVsContainerComponent } from './samples/template-vs-container/template-vs-container.component';
import { TypedNonnullableComponent } from './samples/typed-nonnullable/typed-nonnullable.component';
import { ViewChildComponent } from './samples/view-child/view-child.component';
import { FormErrorsComponent } from './samples/form-errors/form-errors.component';
import { ErrStateMatcherComponent } from './samples/err-state-matcher/err-state-matcher.component';
import { DirectiveCompositionComponent } from './samples/directive-composition/directive-composition.component';
import { ContentProjectionComponent } from './samples/content-projection/content-projection.component';
import { ContainerPresenterComponent } from './samples/container-presenter/container-presenter.component';
import { DynamicComponentsComponent } from './samples/dynamic-components/dynamic-components.component';
import { ControlFlowComponent } from './samples/control-flow/control-flow.component';

const demoRoutes: Routes = [
  {
    path: '',
    component: DemoContainerComponent,
    children: [
      { path: 'control-flow', component: ControlFlowComponent },
      { path: 'standalone', component: StandaloneComponent },
      {
        path: 'lazy-standalone',
        loadComponent: () =>
          import('./samples/lazy-standalone/lazy-standalone.component').then(
            (c) => c.LazyStandaloneComponent
          ),
      },
      { path: 'standalone-bootstrap', component: BootstrapStandaloneComponent },
      { path: 'valuecontrol', component: ControlValueAccessorComponent },
      { path: 'viewchild', component: ViewChildComponent },
      { path: 'contentchild', component: ContentChildComponent },
      { path: 'template-vs-container', component: TemplateVsContainerComponent },
      { path: 'hostbinding', component: HostBindingListenerComponent },
      { path: 'reactivenested', component: ReactiveNestedComponent },
      { path: 'validation-typed', component: ReactiveTypedValidationComponent },
      { path: 'content-projection', component: ContentProjectionComponent },
      { path: 'container-presenter', component: ContainerPresenterComponent },
      { path: 'reactiveforms', component: ReactiveFormsComponent },
      { path: 'actionstream', component: ActionStreamsComponent },
      { path: 'formbuilder', component: FormBuilderComponent },
      { path: 'formcontrol', component: FormControlComponent },
      { path: 'formarray', component: FormArrayComponent },
      { path: 'form-errors', component: FormErrorsComponent },
      { path: 'err-state-matcher', component: ErrStateMatcherComponent },
      { path: 'dynamic-components', component: DynamicComponentsComponent },
      { path: 'validation', component: ReactiveValidationComponent },
      { path: 'cascade', component: ReactiveCascadeComponent },
      { path: 'typedforms', component: ReactiveTypedComponent },
      { path: 'typedformsexplicit', component: ReactiveExplicitTypedComponent },
      {
        path: 'raw-value',
        component: GetRawValueComponent,
      },
      { path: 'typednonnullable', component: TypedNonnullableComponent },
      {
        path: 'directives-composition',
        component: DirectiveCompositionComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(demoRoutes)],
  exports: [RouterModule],
})
export class DemoRoutingModule { }
