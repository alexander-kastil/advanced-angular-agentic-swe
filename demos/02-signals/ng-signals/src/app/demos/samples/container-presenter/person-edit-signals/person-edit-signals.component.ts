import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Person } from '../person.model';

@Component({
  selector: 'app-person-edit-signals',
  imports: [ReactiveFormsModule],
  templateUrl: './person-edit-signals.component.html',
  styleUrl: './person-edit-signals.component.scss'
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