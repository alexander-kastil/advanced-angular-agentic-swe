import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonService } from '../person/person.service';

@Injectable({ providedIn: 'root' })
export class asyncMailExistsValidator implements AsyncValidator {
  ps = inject(PersonService);

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.ps.checkMailExists(ctrl.value).pipe(
      map((exists) => {
        return exists ? { mailExists: true } : null;
      })
    );
  }
}
