import { Component, OnInit, inject } from '@angular/core';
import { PersonService } from '../person/person.service';
import { Person } from '../person/person.model';
import { PresenterEditComponent } from './presenter-edit/presenter-edit.component';
import { PresenterListComponent } from './presenter-list/presenter-list.component';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-container-presenter',
    templateUrl: './container-presenter.component.html',
    styleUrls: ['./container-presenter.component.scss'],
    standalone: true,
    imports: [MarkdownRendererComponent, PresenterListComponent, PresenterEditComponent]
})
export class ContainerPresenterComponent implements OnInit {
  ps = inject(PersonService);
  persons: Person[] = [];
  current: Person | null = null;

  ngOnInit() {
    this.ps.getPersons().subscribe((data) => {
      this.persons = data;
    });
  }

  onPersonSelected(p: Person) {
    this.current = { ...p };
  }

  onPersonSaved(p: Person) {
    console.log('saving to service:', p);
    const existing: Person | undefined = this.persons.find((i) => i.id == p.id);
    if (existing) {
      Object.assign(existing, p);
    } else {
      this.persons.push(p);
    }
    console.log('Persons array after save', this.persons);
  }
}
