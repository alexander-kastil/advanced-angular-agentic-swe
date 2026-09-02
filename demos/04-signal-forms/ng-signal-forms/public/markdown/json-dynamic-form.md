A schema function is just code, so nothing stops it from reading a JSON description and applying validators in a loop. That is the whole trick behind a runtime-built Signal Form.

## The descriptor

`form-schema.ts` holds plain data, the kind a backend or a CMS would return:

```typescript
export type FieldKind = 'text' | 'email' | 'number' | 'date';

export interface FieldDescriptor {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
}
```

## Model from the descriptor

The model is a `Record<string, string>` seeded with one empty entry per descriptor field:

```typescript
private emptyModel(descriptor: JsonFormDescriptor): DynamicModel {
  return Object.fromEntries(descriptor.fields.map((f) => [f.key, '']));
}
```

Keeping every value a string is deliberate. Signal Forms binds native inputs by DOM type, and for `type="number"` or `type="date"` it only takes the numeric or `Date` path when the model value is already a number or a `Date`. With string values it falls through to `element.value`, so one uniform model type drives all four input kinds.

## Schema from the descriptor

```typescript
const fields = form(model, (s: SchemaPathTree<DynamicModel>) => {
  for (const field of descriptor.fields) {
    const path = s[field.key];
    if (field.required) {
      required(path, { message: `${field.label} is required` });
    }
    if (field.minLength !== undefined) {
      minLength(path, field.minLength, { message: `At least ${field.minLength} characters` });
    }
    if (field.maxLength !== undefined) {
      maxLength(path, field.maxLength, { message: `At most ${field.maxLength} characters` });
    }
    if (field.kind === 'email') {
      email(path, { message: 'Not a valid email address' });
    }
    if (field.pattern) {
      pattern(path, new RegExp(field.pattern), {
        message: field.patternMessage ?? 'Does not match the required format',
      });
    }
  }
});
```

`SchemaPathTree<Record<string, string>>` is indexable by string, so `s[field.key]` is a well-typed path to a `string` field.

## One form per descriptor

`form()` needs an injection context and builds a fixed field structure, so it is not something to call from a `computed()` on every keystroke. The demo builds one form per descriptor during construction and a `computed()` selects the active one:

```typescript
private readonly builtForms: BuiltForm[] = FORM_DESCRIPTORS.map((descriptor) => this.build(descriptor));

readonly active = computed(
  () => this.builtForms.find((f) => f.descriptor.id === this.selectedId()) ?? this.builtForms[0],
);
```

If descriptors arrive at runtime rather than at build time, build the form once the descriptor resolves and pass an explicit `injector` in the third argument of `form()`.

## Rendering

The template iterates the descriptor, not the model:

```html
@for (f of active().descriptor.fields; track f.key) {
  <div class="field">
    <label class="label" [for]="'jdf-' + f.key">{{ f.label }}</label>
    <input [id]="'jdf-' + f.key" class="input" [type]="f.kind" [formField]="active().fields[f.key]" />
  </div>
}
```
