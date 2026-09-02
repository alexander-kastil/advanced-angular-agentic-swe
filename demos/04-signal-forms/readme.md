# Signal Forms

Angular's signal-based forms API replaces the traditional Reactive Forms model with a schema-driven approach that integrates naturally with signals. This module covers form construction with `form()` and `[formField]`, built-in and custom validators, cross-field and date rules, `validateStandardSchema()`, server-side validation with `validateHttp()` and `validateAsync()`, nested models, form arrays, conditional field logic, submission options, custom controls via `FormValueControl`, runtime-built forms from a JSON descriptor, accessible autocomplete with `@angular/aria`, and Angular Material error presentation via `isSignalErrorState()`. The last two demos are agent-facing: exposing a form as a WebMCP tool, and reviewing the Vitest spec an agent writes for a form. Every piece of field state is a signal, so templates read `valid()`, `touched()`, `dirty()` and `pending()` without a single subscription.

Run the API before starting the app:

```bash
json-server db.json
npm start
```

## Demos

| # | Route | Title | Teaches |
|---|-------|-------|---------|
| 1 | form-control | Fields, Values & State | Build a form with form() and a schema. Read and write values through field state, and consume valid, touched, dirty and pending as signals in the template. |
| 2 | signal-forms-submit | Form Submission | Use submit() to mark all fields as touched and only invoke the action when the form is valid. Covers the submission options on form() - action, onInvalid and ignoreValidators - returning server errors onto a field, and wiring the native submit event with [formRoot]. |
| 3 | reactive-nested | Nested Objects | Bind nested model objects like address with sub-properties (street, city, postalCode). Access nested fields via dot notation in the schema. |
| 4 | form-array | Form Arrays | Work with arrays of objects using applyEach to validate each item. Add and remove items dynamically from the form array. |
| 5 | validation-typed | Validation & Cross-Field Rules | Combine built-in validators (required, minLength, email) with custom validate() rules that read sibling fields via valueOf(): password matching, at-least-one-service and email-or-phone. Also validates a whole model through validateStandardSchema(). |
| 6 | signal-form-arrays-objects | Arrays with Schema | Validate arrays of nested objects using reusable schema() definitions. Combine with conditional validation using the when option on required. |
| 7 | signal-form-null-values | Nullable & Optional Fields | Keep a plain form model next to a nullable domain model and map between them. Guard validators with applyWhenValue() so they only run once a value is present. |
| 8 | validation | Async Validation | Validate against the server with validateHttp() and with validateAsync() over an rxResource. Debounce requests and read the pending() signal while they are in flight. |
| 9 | signal-form-when | Conditional Validators | Activate validators conditionally using the when option on required() and applyWhen(). Validators toggle based on other field values. |
| 10 | date-validators | Date Validators | Constrain Date fields with minDate() and maxDate(), derive one bound from a sibling field, and read the typed error objects back with getError('minDate') and getError('maxDate'). |
| 11 | form-errors | Error Display | Aggregate and display errors across multiple fields using computed() over field.errors(). Combine minLength, maxLength, and custom validators. |
| 12 | err-state-matcher | ErrorStateMatcher | Control when Angular Material renders mat-error by implementing isSignalErrorState() on a custom ErrorStateMatcher, registered per control or per component. |
| 13 | signal-forms-conditional | Conditional Fields | Control field visibility and interactivity with hidden(), disabled(), and readonly(). Toggle field states based on other field values. |
| 14 | cascade | Cascading Dropdowns | Derive the options of a second select from the first using applyEach, disabled() and a conditional required(). Add, remove and reset dependent rows. |
| 15 | signal-forms-pets | Pets CRUD | Complete CRUD workflow: list, select, edit, and create pets from a service. Tracks model changes via effect() into a change log. |
| 16 | container-presenter | Container Presenter + Signal Store | Implement the container-presenter pattern with a Signal Form edit component. The container uses a scoped NgRx Signal Store (PersonStore) to load persons via HTTP, track selection, and persist saves back to the API. |
| 17 | form-value-control | Custom Controls | Implement FormValueControl on your own components so [formField] binds them like a native input, and map a raw UI string to a typed model value with transformedValue(). |
| 18 | json-dynamic-form | Dynamic Forms from JSON | Build the model and the schema at runtime by walking a JSON field descriptor, applying required, minLength, maxLength, email and pattern per descriptor entry. |
| 19 | aria-autocomplete | Accessible Autocomplete | Wire the headless ngCombobox, ngComboboxPopup and ngListbox primitives from @angular/aria into a Signal Form field, with filtering, keyboard navigation and a membership validator. |
| 20 | reactive-forms-migration | Reactive Forms Migration | The same profile form built twice, in ReactiveFormsModule and in Signal Forms, side by side with the step-by-step migration list. |
| 21 | webmcp-form-tool | Form as an Agent Tool | Expose a Signal Form to a browser agent: provideExperimentalWebMcpForms() plus the experimentalWebMcpTool option on form(), and an explicit read tool via declareExperimentalWebMcpTool(). |
| 22 | ai-written-form-tests | Reviewing AI-Written Form Tests | A Signal Form with the Vitest spec an agent produced for it, the review checklist that catches a weak spec, and a mutation switch that proves the spec fails when the schema really breaks. |
