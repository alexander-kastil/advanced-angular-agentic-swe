import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Field } from '@angular/forms/signals';

export interface FieldErrorStateMatcher {
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean;
  isSignalErrorState<T>(field: Field<T> | null): boolean;
}

export class DirtyOnlyStateMatcher implements FieldErrorStateMatcher {
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!control && control.invalid && control.dirty;
  }

  isSignalErrorState<T>(field: Field<T> | null): boolean {
    if (!field) {
      return false;
    }
    const state = field();
    return state.invalid() && state.dirty();
  }
}

export class EagerStateMatcher implements FieldErrorStateMatcher {
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!control && control.invalid;
  }

  isSignalErrorState<T>(field: Field<T> | null): boolean {
    return !!field && field().invalid();
  }
}
