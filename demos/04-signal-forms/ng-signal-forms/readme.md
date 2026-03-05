# Signal Forms

| # | Route | Title | Teaches |
|---|-------|-------|---------|
| 1 | form-control | Fields & Values | Create form fields with form() and FormField. Read values with .value() and update them imperatively with .value.set(). |
| 2 | control-events | Field State & Events | React to field-level state signals like touched, dirty, and errors. Use these signals in the template for dynamic UI feedback. |
| 3 | form-builder | Model & Custom Rules | Build forms with custom validation rules using validate() and regex patterns. Observe reactive model updates pushed via setTimeout. |
| 4 | signal-forms-submit | Form Submission | Use submit() to mark all fields as touched and only invoke the callback when the form is valid. Ideal pattern for login forms. |
| 5 | reactive-nested | Nested Objects | Bind nested model objects like address with sub-properties (street, city, postalCode). Access nested fields via dot notation in the schema. |
| 6 | form-array | Form Arrays | Work with arrays of objects using applyEach to validate each item. Add and remove items dynamically from the form array. |
| 7 | signal-form-arrays-objects | Arrays with Schema | Validate arrays of nested objects using reusable schema() definitions. Combine with conditional validation using the when option on required. |
| 8 | signal-form-null-values | Nullable Fields | Handle nullable and NaN model properties (string \| null, number \| null). Use applyWhenValue() to validate only when a value is non-null. |
| 9 | validation-typed | Validation Basics | Learn built-in validators (required, minLength, email) and introduce cross-field validation with validate() and valueOf(). Implement password confirmation matching. |
| 10 | validation | Async Validators | Combine sync validators with async validation using validateAsync() and rxResource for server-side uniqueness checks. |
| 11 | form-errors | Error Display | Aggregate and display errors across multiple fields using computed() over field.errors(). Combine minLength, maxLength, and custom validators. |
| 12 | err-state-matcher | ErrorStateMatcher | Customize when errors appear using ErrorStateMatcher with traditional Reactive Forms. Demonstrates cross-field password validation with updateOn blur. |
| 13 | signal-form-validate | Cross-Field Rules | Write custom cross-field validation using validate() with ctx.valueOf() to read sibling fields. Enforce rules like 'provide email or phone'. |
| 14 | signal-form-when | Conditional Validators | Activate validators conditionally using the when option on required() and applyWhen(). Validators toggle based on other field values. |
| 15 | signal-forms-conditional | Conditional Fields | Control field visibility and interactivity with hidden(), disabled(), and readonly(). Toggle field states based on other field values. |
| 16 | cascade | Cascading Dropdowns | Build dependent dropdown controls where selecting a category filters the available values in a second dropdown. Uses form arrays with applyEach. |
| 17 | signal-forms-pets | Pets CRUD | Complete CRUD workflow: list, select, edit, and create pets from a service. Tracks model changes via effect() into a change log. |
