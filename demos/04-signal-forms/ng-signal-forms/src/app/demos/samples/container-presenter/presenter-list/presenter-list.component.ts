import { Component, input, output } from '@angular/core';
import { Person } from '../../person/person.model';

@Component({
  selector: 'app-presenter-list',
  templateUrl: './presenter-list.component.html',
  styleUrls: ['./presenter-list.component.scss'],
})
export class PresenterListComponent {
  readonly persons = input<Person[]>([]);
  readonly personSelected = output<Person>();

  selectPerson(p: Person) {
    this.personSelected.emit(p);
  }
}
