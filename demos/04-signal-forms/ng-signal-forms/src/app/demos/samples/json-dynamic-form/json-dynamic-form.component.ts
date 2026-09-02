import { JsonPipe } from '@angular/common';
import { Component, WritableSignal, computed, signal } from '@angular/core';
import {
  FieldTree,
  FormField,
  SchemaPathTree,
  email,
  form,
  maxLength,
  minLength,
  pattern,
  required,
  submit,
} from '@angular/forms/signals';
import { BoxedDirective, ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { FORM_DESCRIPTORS, FieldDescriptor, JsonFormDescriptor } from './form-schema';

type DynamicModel = Record<string, string>;

interface BuiltForm {
  descriptor: JsonFormDescriptor;
  model: WritableSignal<DynamicModel>;
  fields: FieldTree<DynamicModel>;
}

@Component({
  selector: 'app-json-dynamic-form',
  templateUrl: './json-dynamic-form.component.html',
  styleUrls: ['./json-dynamic-form.component.scss'],
  imports: [
    FormField,
    BoxedDirective, ColumnDirective, JsonPipe,
  ],
})
export class JsonDynamicFormComponent {
  readonly descriptors = FORM_DESCRIPTORS;
  readonly selectedId = signal(FORM_DESCRIPTORS[0].id);
  readonly submittedValue = signal<DynamicModel | null>(null);

  private readonly builtForms: BuiltForm[] = FORM_DESCRIPTORS.map((descriptor) => this.build(descriptor));

  readonly active = computed(
    () => this.builtForms.find((f) => f.descriptor.id === this.selectedId()) ?? this.builtForms[0],
  );

  readonly descriptorJson = computed(() => this.active().descriptor);

  errorsOf(field: FieldDescriptor): readonly { kind: string; message?: string }[] {
    const state = this.active().fields[field.key]();
    return state.touched() ? state.errors() : [];
  }

  send(): void {
    const current = this.active();
    submit(current.fields, async () => {
      this.submittedValue.set(current.model());
    });
  }

  clear(): void {
    const current = this.active();
    current.model.set(this.emptyModel(current.descriptor));
    current.fields().reset();
    this.submittedValue.set(null);
  }

  private build(descriptor: JsonFormDescriptor): BuiltForm {
    const model = signal<DynamicModel>(this.emptyModel(descriptor));
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
    return { descriptor, model, fields };
  }

  private emptyModel(descriptor: JsonFormDescriptor): DynamicModel {
    return Object.fromEntries(descriptor.fields.map((f) => [f.key, '']));
  }
}
