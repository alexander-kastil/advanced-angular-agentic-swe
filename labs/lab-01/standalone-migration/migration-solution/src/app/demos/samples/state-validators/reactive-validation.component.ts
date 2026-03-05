import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Person, wealthOptsValues } from '../person/person.model';
import { PersonService } from '../person/person.service';
import { AsyncMailExistsValidator } from './asyncMailExistsValidator';
import { MatButton } from '@angular/material/button';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-reactive-validation',
    templateUrl: './reactive-validation.component.html',
    styleUrls: ['./reactive-validation.component.scss'],
    standalone: true,
    imports: [
        MarkdownRendererComponent,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        FormsModule,
        ColumnDirective,
        ReactiveFormsModule,
        MatInput,
        MatFormField,
        MatLabel,
        MatError,
        MatSelect,
        MatOption,
        MatRadioGroup,
        MatRadioButton,
        MatButton,
    ],
})
export class ReactiveValidationComponent {
  fb: FormBuilder = inject(FormBuilder);
  ps: PersonService = inject(PersonService);
  mailExistsValidator: AsyncMailExistsValidator = inject(AsyncMailExistsValidator);
  person: Person = new Person();
  wealthOpts = wealthOptsValues;

  errors$: Observable<any> | undefined;

  personForm = this.fb.group({
    id: [this.person.id],
    name: [
      this.person.name,
      {
        nonNullable: true,
        validators: [Validators.required, this.validateName],
      },
    ],
    lastname: [this.person.lastname, [Validators.required]],
    age: [this.person.age, [Validators.min(6), Validators.max(110)], [], { nonNullable: true }],
    gender: [this.person.gender],
    email: [
      this.person.email,
      {
        nonNullable: true,
        updateOn: 'blur',
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.mailExistsValidator],
      },
    ],
    wealth: [this.person.wealth],
  });

  ngOnInit() {
    this.ps
      .getPerson()
      .pipe(delay(2000))
      .subscribe((p) => {
        this.personForm.patchValue(p);
      });
  }

  savePerson(personForm: any): void {
    this.ps.save(personForm);
  }

  //Sample for custom Validator - name
  validateName(control: FormControl): { [s: string]: boolean } | null {
    if ((control.value as string).toLowerCase() === 'asshole') {
      return { nameError: true };
    }
    return null;
  }

  violatesMinLenght() {
    return (
      this.personForm.controls.name.touched &&
      this.personForm.controls.name.hasError('minlength')
    );
  }

  validateForm() {
    this.personForm.updateValueAndValidity();
    this.personForm.controls['name'].updateValueAndValidity();
  }
}
