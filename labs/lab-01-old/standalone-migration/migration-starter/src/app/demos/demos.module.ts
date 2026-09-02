import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import { MaterialModule } from '../material.module';
import { MarkdownRendererModule } from '../shared/markdown-renderer/markdown-renderer.module';
import { SharedModule } from '../shared/shared.module';
import { UxLibModule } from '../shared/ux-lib/ux-lib.module';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { DemoRoutingModule } from './demo.routing.module';
import { ActionStreamsComponent } from './samples/action-streams/action-streams.component';
import { BootstrapStandaloneComponent } from './samples/bootstrap-standalone/bootstrap-standalone.component';
import { ReactiveCascadeComponent } from './samples/cascade/reactive-cascade.component';
import { ContainerPresenterComponent } from './samples/container-presenter/container-presenter.component';
import { PresenterEditComponent } from './samples/container-presenter/presenter-edit/presenter-edit.component';
import { PresenterListComponent } from './samples/container-presenter/presenter-list/presenter-list.component';
import { ContentChildComponent } from './samples/content-child/content-child.component';
import { ProjectorComponent } from './samples/content-child/projector/projector.component';
import { ContentProjectionComponent } from './samples/content-projection/content-projection.component';
import { SplitPopupComponent } from './samples/content-projection/split-popup/split-popup.component';
import { ControlValueAccessorComponent } from './samples/control-value-accessor/control-value-accessor.component';
import { NumberPickerComponent } from './samples/control-value-accessor/number-picker/number-picker.component';
import { DirectiveCompositionComponent } from './samples/directive-composition/directive-composition.component';
import { DynamicComponentsComponent } from './samples/dynamic-components/dynamic-components.component';
import { ErrStateMatcherComponent } from './samples/err-state-matcher/err-state-matcher.component';
import { ReactiveExplicitTypedComponent } from './samples/explicit-typed/reactive-explicit-typed.component';
import { FormArrayComponent } from './samples/form-array/form-array.component';
import { FormControlComponent } from './samples/form-control/form-control.component';
import { FormErrorsComponent } from './samples/form-errors/form-errors.component';
import { FormBuilderComponent } from './samples/forms-builder/forms-builder.component';
import { GetRawValueComponent } from './samples/get-raw-value/get-raw-value.component';
import { BindingComponent } from './samples/host-binding-listener/binding/binding.component';
import { HostBindingListenerComponent } from './samples/host-binding-listener/host-binding-listener.component';
import { HoverListenerDirective } from './samples/host-binding-listener/hover-listener.directive';
import { ReactiveNestedComponent } from './samples/nested-objects/reactive-nested.component';
import { ReactiveFormsComponent } from './samples/reactive-forms/reactive-forms.component';
import { StandaloneComponent } from './samples/standalone/standalone.component';
import { ReactiveValidationComponent } from './samples/state-validators/reactive-validation.component';
import { ClockComponent } from './samples/template-vs-container/clock/clock.component';
import { ExpanderComponent } from './samples/template-vs-container/expander-content/expander.component';
import { ExpanderTemplateComponent } from './samples/template-vs-container/expander-template/expander-template.component';
import { TemplateVsContainerComponent } from './samples/template-vs-container/template-vs-container.component';
import { TypedNonnullableComponent } from './samples/typed-nonnullable/typed-nonnullable.component';
import { ReactiveTypedComponent } from './samples/typed/reactive-typed.component';
import { ReactiveTypedValidationComponent } from './samples/validaton-intro/reactive-typed-validaton.component';
import { ViewChildComponent } from './samples/view-child/view-child.component';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline',
};

@NgModule({ declarations: [
        DemoContainerComponent,
        ReactiveFormsComponent,
        FormBuilderComponent,
        ContentProjectionComponent,
        FormControlComponent,
        FormArrayComponent,
        ReactiveValidationComponent,
        ReactiveCascadeComponent,
        ActionStreamsComponent,
        ReactiveNestedComponent,
        ControlValueAccessorComponent,
        NumberPickerComponent,
        ReactiveTypedComponent,
        TypedNonnullableComponent,
        ReactiveExplicitTypedComponent,
        GetRawValueComponent,
        BootstrapStandaloneComponent,
        HostBindingListenerComponent,
        TemplateVsContainerComponent,
        ViewChildComponent,
        ContentChildComponent,
        ExpanderComponent,
        ClockComponent,
        ExpanderTemplateComponent,
        BindingComponent,
        HoverListenerDirective,
        ProjectorComponent,
        ReactiveTypedValidationComponent,
        FormErrorsComponent,
        ErrStateMatcherComponent,
        DirectiveCompositionComponent,
        SplitPopupComponent,
        ContainerPresenterComponent,
        PresenterListComponent,
        PresenterEditComponent,
        DynamicComponentsComponent
    ], imports: [CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        DemoRoutingModule,
        MaterialModule,
        MarkdownRendererModule,
        StandaloneComponent,
        UxLibModule], providers: [
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: appearance,
        },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class DemosModule { }
