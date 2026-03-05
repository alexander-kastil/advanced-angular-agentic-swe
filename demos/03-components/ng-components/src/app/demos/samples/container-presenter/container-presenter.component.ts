import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PersonService } from '../person/person.service';
import { Person } from '../person/person.model';
import { PresenterEditComponent } from './presenter-edit/presenter-edit.component';
import { PresenterListComponent } from './presenter-list/presenter-list.component';

@Component({
  selector: 'app-container-presenter',
  templateUrl: './container-presenter.component.html',
  styleUrls: ['./container-presenter.component.scss'],
  imports: [PresenterListComponent, PresenterEditComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerPresenterComponent {
  private ps = inject(PersonService);
  persons = toSignal(this.ps.getPersons(), { initialValue: [] });
  current = signal<Person | null>(null);

  onPersonSelected(p: Person) {
    this.current.set({ ...p });
  }

  onPersonSaved(p: Person) {
    console.log('saving to service:', p);
    const personsArray = this.persons();
    const existing: Person | undefined = personsArray.find((i) => i.id == p.id);
    if (existing) {
      Object.assign(existing, p);
    } else {
      personsArray.push(p);
    }
    console.log('Persons array after save', personsArray);
  }
}
