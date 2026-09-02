import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Field } from '@angular/forms/signals';
import { ErrorStateMatcher } from '@angular/material/core';

export class DirtyOnlyStateMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!control && control.invalid && control.dirty;
  }

  isSignalErrorState(field: Field<unknown> | null): boolean {
    if (!field) {
      return false;
    }
    const state = field();
    return state.invalid() && state.dirty();
  }
}

export class EagerStateMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!control && control.invalid;
  }

  isSignalErrorState(field: Field<unknown> | null): boolean {
    return !!field && field().invalid();
  }
}
