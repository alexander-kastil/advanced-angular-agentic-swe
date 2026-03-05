import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { Person } from '../../person/person.model';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { ColumnDirective } from '../../../../shared/formatting/formatting-directives';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';

@Component({
  selector: 'app-presenter-edit',
  templateUrl: './presenter-edit.component.html',
  styleUrls: ['./presenter-edit.component.scss'],
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, FormsModule, ColumnDirective, ReactiveFormsModule, MatFormField, MatInput, MatCardActions, MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PresenterEditComponent {
  readonly person = input.required<Person>();
  readonly allowSaveString = input('');
  readonly savePerson = output<Person>();

  private fb = inject(FormBuilder);
  protected allowSave = true;
  protected personForm: FormGroup;

  constructor() {
    this.personForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(120)]],
    });
    this.setupPersonSync();
  }

  private setupPersonSync() {
    effect(() => {
      const p = this.person();
      this.personForm.patchValue({
        id: p.id,
        name: p.name,
        age: p.age
      });
    });
    effect(() => {
      this.allowSave = this.allowSaveString() === 'true';
    });
  }

  doSave() {
    let p = { ... this.person, ... this.personForm.value };
    this.savePerson.emit(p);
  }

  doDelete() {
    console.log(`deleting ${this.person.name}`);
  }
}
