import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';

export const demoRoutes: Routes = [
  {
    path: '',
    component: DemoContainerComponent,
    children: [
      {
        path: 'form-control',
        loadComponent: () =>
          import('./samples/form-control/form-control.component').then((m) => m.FormControlComponent),
      },
      {
        path: 'signal-forms-submit',
        loadComponent: () =>
          import('./samples/signal-forms-submit/signal-forms-submit.component').then((m) => m.SignalFormsSubmitComponent),
      },
      {
        path: 'reactive-nested',
        loadComponent: () =>
          import('./samples/reactive-nested/reactive-nested.component').then((m) => m.ReactiveNestedComponent),
      },
      {
        path: 'form-array',
        loadComponent: () =>
          import('./samples/form-array/form-array.component').then((m) => m.FormArrayComponent),
      },
      {
        path: 'validation-typed',
        loadComponent: () =>
          import('./samples/validation-typed/validation-typed.component').then((m) => m.ReactiveTypedValidationComponent),
      },
      {
        path: 'signal-form-arrays-objects',
        loadComponent: () =>
          import('./samples/signal-form-arrays-objects/signal-form-arrays-objects.component').then((m) => m.SfArraysObjectsComponent),
      },
      {
        path: 'signal-form-null-values',
        loadComponent: () =>
          import('./samples/signal-form-null-values/signal-form-null-values.component').then((m) => m.SfNullValuesComponent),
      },
      {
        path: 'validation',
        loadComponent: () =>
          import('./samples/validation/validation.component').then((m) => m.ReactiveValidationComponent),
      },
      {
        path: 'date-validators',
        loadComponent: () =>
          import('./samples/date-validators/date-validators.component').then((m) => m.DateValidatorsComponent),
      },
      {
        path: 'signal-form-when',
        loadComponent: () =>
          import('./samples/signal-form-when/signal-form-when.component').then((m) => m.SfWhenComponent),
      },
      {
        path: 'form-errors',
        loadComponent: () =>
          import('./samples/form-errors/form-errors.component').then((m) => m.FormErrorsComponent),
      },
      {
        path: 'err-state-matcher',
        loadComponent: () =>
          import('./samples/err-state-matcher/err-state-matcher.component').then((m) => m.ErrStateMatcherComponent),
      },
      {
        path: 'signal-forms-conditional',
        loadComponent: () =>
          import('./samples/signal-forms-conditional/signal-forms-conditional.component').then((m) => m.SignalFormsConditionalComponent),
      },
      {
        path: 'cascade',
        loadComponent: () =>
          import('./samples/cascade/cascade.component').then((m) => m.ReactiveCascadeComponent),
      },
      {
        path: 'signal-forms-pets',
        loadComponent: () =>
          import('./samples/signal-forms-pets/signal-forms-pets.component').then((m) => m.SignalFormsPetsComponent),
      },
      {
        path: 'container-presenter',
        loadComponent: () =>
          import('./samples/container-presenter/container-presenter.component').then((m) => m.ContainerPresenterComponent),
      },
      {
        path: 'form-value-control',
        loadComponent: () =>
          import('./samples/form-value-control/form-value-control.component').then((m) => m.FormValueControlComponent),
      },
      {
        path: 'json-dynamic-form',
        loadComponent: () =>
          import('./samples/json-dynamic-form/json-dynamic-form.component').then((m) => m.JsonDynamicFormComponent),
      },
      {
        path: 'aria-autocomplete',
        loadComponent: () =>
          import('./samples/aria-autocomplete/aria-autocomplete.component').then((m) => m.AriaAutocompleteComponent),
      },
      {
        path: 'reactive-forms-migration',
        loadComponent: () =>
          import('./samples/reactive-forms-migration/reactive-forms-migration.component').then(
            (m) => m.ReactiveFormsMigrationComponent,
          ),
      },
      {
        path: 'ai-written-form-tests',
        loadComponent: () =>
          import('./samples/ai-written-form-tests/ai-written-form-tests.component').then(
            (m) => m.AiWrittenFormTestsComponent,
          ),
      },
    ],
  },
];
