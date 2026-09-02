import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Person } from '../../person/person.model';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-presenter-list',
  templateUrl: './presenter-list.component.html',
  styleUrls: ['./presenter-list.component.scss'],
  imports: [MatCard, MatCardHeader, MatCardTitle],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PresenterListComponent {
  readonly persons = input<Person[]>([]);
  readonly personSelected = output<Person>();

  selectPerson(p: Person) {
    this.personSelected.emit(p);
  }
}
