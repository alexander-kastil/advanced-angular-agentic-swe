import { Component, OnInit, inject } from '@angular/core';
import { Validators, FormBuilder, NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Person, wealthOptsValues } from '../person/person.model';
import { PersonService } from '../person/person.service';
import { MatButton } from '@angular/material/button';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-get-raw-value',
    templateUrl: './get-raw-value.component.html',
    styleUrls: ['./get-raw-value.component.scss'],
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
        MatFormField,
        MatLabel,
        MatInput,
        MatSelect,
        MatOption,
        MatRadioGroup,
        MatRadioButton,
        MatButton,
    ],
})
export class GetRawValueComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  ps: PersonService = inject(PersonService);
  person: Person = new Person();
  wealthOpts = wealthOptsValues;
  genderPattern = '^(male|female)';

  personForm = this.fb.group({
    id: [0],
    name: ['', { validators: [Validators.required] }],
    age: [0, { validators: [Validators.min(1)] }],
    email: ['', { validators: [Validators.email] }],
    gender: ['', { validators: [Validators.pattern(this.genderPattern)] }],
    wealth: [''],
  });

  ngOnInit() {
    this.ps.getPerson().subscribe((p) => {
      //Reminder: setValue vs patchValue
      this.personForm.patchValue(p);
      console.log('Data loaded from service', p);
    });

    setTimeout(() => {
      //Use this to update form incrementally
      this.personForm.patchValue({ name: 'Soi' });
      console.log('Cleo changed to Soi');
    }, 3000);
  }

  toggleId() {
    this.personForm.controls.id.disable();
  }

  savePerson(): void {
    this.ps.save(this.personForm as unknown as NgForm);
  }

  getRawValue(): void {
    console.log('Getting raw value the whole form:', this.personForm.getRawValue());
  }
}
