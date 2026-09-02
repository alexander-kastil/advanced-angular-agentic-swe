Built-in validators are applied inside the schema function. `validate()` adds a custom rule, and `valueOf()` reads a sibling field so the rule can span several fields.

```typescript
registerForm = form(this.registerModel, (s) => {
  required(s.email, { message: "Email is required" });
  email(s.email, { message: "Invalid email" });
  required(s.password, { message: "Password is required" });
  minLength(s.password, 4, { message: "Min 4 characters" });
  required(s.passwordRepeat, { message: "Please repeat password" });
  validate(s.passwordRepeat, ({ value, valueOf }) =>
    value() !== valueOf(s.password) ? { kind: "mismatch", message: "Passwords do not match" } : null,
  );
});
```

The second form on this page shows two more cross-field rules: at least one of two checkboxes, and either an email or a phone number.

```typescript
validate(s.wantsInsurance, ({ value, valueOf }) =>
  value() || valueOf(s.wantsTraining) ? null : { kind: "serviceMissing", message: "Pick insurance or training" },
);

validate(s.contactEmail, ({ value, valueOf }) =>
  value() || valueOf(s.contactPhone) ? null : { kind: "contactMissing", message: "Provide either email or phone" },
);
```

A validator returns `null` when the value is acceptable, or a `{ kind, message }` error object. `submit()` marks every field touched and only runs the callback when the form is valid.

## validateStandardSchema

The third form on this page validates through a [Standard Schema](https://standardschema.dev) object instead of individual rules. Zod, Valibot and ArkType all implement that interface, so a schema already used by the backend can validate the form unchanged:

```typescript
microchipForm = form(this.microchipModel, (s) => {
  validateStandardSchema(s, microchipSchema);
});
```

The path argument is the root of the field tree (or any object-valued subtree), not a leaf: the schema validates the whole shape at once and reports issues per property.

`microchip-schema.ts` implements the interface by hand so the demo needs no extra dependency, which also shows exactly what a library provides:

```typescript
export const microchipSchema: StandardSchemaV1<MicrochipModel> = {
  '~standard': {
    version: 1,
    vendor: 'ng-signal-forms-demo',
    validate: (value) => {
      const model = value as MicrochipModel;
      const issues: StandardSchemaV1.Issue[] = [];
      if (!/^[0-9]{15}$/.test(model.chipId)) {
        issues.push({ message: 'A microchip id is exactly 15 digits', path: ['chipId'] });
      }
      return issues.length ? { issues } : { value: model };
    },
  },
};
```

Each issue's `path` is what routes the message to a field, so `chipId` errors land in `microchipForm.chipId().errors()`. The errors arrive with `kind: 'standardSchema'` and carry the original `issue`, so a template can read `err.message` like any other error while code that needs the detail reaches for `getError('standardSchema')?.issue`.

Mix and match freely: `validateStandardSchema()` on the root plus `required()` or `validate()` on individual fields all contribute to the same error list.
