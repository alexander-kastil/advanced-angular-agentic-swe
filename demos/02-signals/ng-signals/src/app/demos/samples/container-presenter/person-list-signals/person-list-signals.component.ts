import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Person } from '../person.model';

@Component({
  selector: 'app-person-list-signals',
  imports: [
    MatCardModule
  ],
  templateUrl: './person-list-signals.component.html',
  styleUrl: './person-list-signals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonListSignalsComponent {
  persons = input.required<Person[]>(); //@Input
  personSelected = output<Person>(); //@Output

  selectPerson(p: Person) {
    this.personSelected.emit(p);
  }
}