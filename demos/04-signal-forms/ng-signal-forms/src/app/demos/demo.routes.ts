import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';

import { FormControlComponent } from './samples/signal-form-control/signal-form-control.component';
import { ControlEventsComponent } from './samples/signal-form-control-events/signal-form-control-events.component';
import { FormBuilderComponent } from './samples/signal-form-builder/signal-form-builder.component';
import { ReactiveNestedComponent } from './samples/signal-form-nested-objects/signal-form-nested-objects.component';
import { FormArrayComponent } from './samples/signal-form-array/signal-form-array.component';
import { ReactiveTypedValidationComponent } from './samples/signal-form-validation-intro/signal-form-validation-intro.component';
import { ReactiveValidationComponent } from './samples/signal-form-validators/signal-form-validators.component';
import { FormErrorsComponent } from './samples/signal-form-errors/signal-form-errors.component';
import { ErrStateMatcherComponent } from './samples/signal-form-err-state-matcher/signal-form-err-state-matcher.component';
import { ReactiveCascadeComponent } from './samples/signal-form-cascade/signal-form-cascade.component';
import { SignalFormsConditionalComponent } from './samples/signal-form-conditional/signal-form-conditional.component';
import { SignalFormsSubmitComponent } from './samples/signal-form-submit/signal-form-submit.component';
import { SignalFormsPetsComponent } from './samples/signal-form-pets/signal-form-pets.component';
import { SfArraysObjectsComponent } from './samples/signal-form-arrays-objects/signal-form-arrays-objects.component';
import { SfNullValuesComponent } from './samples/signal-form-null-values/signal-form-null-values.component';
import { SfValidateComponent } from './samples/signal-form-validate/signal-form-validate.component';
import { SfWhenComponent } from './samples/signal-form-when/signal-form-when.component';

export const demoRoutes: Routes = [
  {
    path: '',
    component: DemoContainerComponent,
    children: [
      { path: 'form-control', component: FormControlComponent },
      { path: 'control-events', component: ControlEventsComponent },
      { path: 'form-builder', component: FormBuilderComponent },
      { path: 'reactive-nested', component: ReactiveNestedComponent },
      { path: 'form-array', component: FormArrayComponent },
      { path: 'validation-typed', component: ReactiveTypedValidationComponent },
      { path: 'validation', component: ReactiveValidationComponent },
      { path: 'form-errors', component: FormErrorsComponent },
      { path: 'err-state-matcher', component: ErrStateMatcherComponent },
      { path: 'cascade', component: ReactiveCascadeComponent },
      { path: 'signal-forms-conditional', component: SignalFormsConditionalComponent },
      { path: 'signal-forms-submit', component: SignalFormsSubmitComponent },
      { path: 'signal-forms-pets', component: SignalFormsPetsComponent },
      { path: 'signal-form-arrays-objects', component: SfArraysObjectsComponent },
      { path: 'signal-form-null-values', component: SfNullValuesComponent },
      { path: 'signal-form-validate', component: SfValidateComponent },
      { path: 'signal-form-when', component: SfWhenComponent },
    ],
  },
];