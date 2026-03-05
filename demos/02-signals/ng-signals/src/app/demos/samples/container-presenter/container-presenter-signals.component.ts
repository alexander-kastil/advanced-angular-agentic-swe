import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { PersonEditSignalsComponent } from './person-edit-signals/person-edit-signals.component';
import { PersonListSignalsComponent } from './person-list-signals/person-list-signals.component';
import { Person } from './person.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-container-presenter-signals',
  imports: [
    PersonListSignalsComponent,
    PersonEditSignalsComponent
  ],
  templateUrl: './container-presenter-signals.component.html',
  styleUrl: './container-presenter-signals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerPresenterSignalsComponent {
  personsResource = httpResource<Person[]>(() => `${environment.api}persons`, { defaultValue: [] });
  current = signal<Person | undefined>(undefined);

  onPersonSelected(p: Person) {
    console.log('Person selected:', p);
    this.current.set(p);
  }

  onPersonSaved(p: Person) {
    console.log('mock saving to service:', p);
    this.personsResource.update(persons => {
      const idx = persons.findIndex(i => i.id === p.id);
      return idx >= 0
        ? persons.map((i, index) => index === idx ? { ...i, ...p } : i)
        : [...persons, p];
    });
    this.current.set(undefined);
  }
}
