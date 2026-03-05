import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Person } from '../person.model';

@Component({
  selector: 'app-person-edit-signals',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
  ],
  templateUrl: './person-edit-signals.component.html',
  styleUrl: './person-edit-signals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonEditSignalsComponent {
  person = input<Person | undefined>();
  onSavePerson = output<Person>();

  personForm = new FormGroup({
    id: new FormControl(this.person()?.id ?? 0),
    name: new FormControl(this.person()?.name ?? ''),
    age: new FormControl(this.person()?.age ?? 0),
    gender: new FormControl(this.person()?.gender ?? 'M')
  })

  personChanged = effect(() => {
    if (this.person() !== null) {
      var p = this.person() as Person;
      this.personForm.patchValue(p);
    }
  });

  savePerson() {
    if (this.person() !== null) {
      const p = this.personForm.value as Person;
      this.onSavePerson.emit(p);
    }
  }

  deletePerson() {
    console.log(`deleting ${this.person()?.name}`);
  }
}