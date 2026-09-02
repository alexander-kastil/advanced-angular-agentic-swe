import { Component, input, output } from '@angular/core';
import { Person } from '../person.model';

@Component({
  selector: 'app-person-list-signals',
  templateUrl: './person-list-signals.component.html',
  styleUrl: './person-list-signals.component.scss'
})
export class PersonListSignalsComponent {
  persons = input.required<Person[]>();
  personSelected = output<Person>();

  selectPerson(p: Person) {
    this.personSelected.emit(p);
  }
}