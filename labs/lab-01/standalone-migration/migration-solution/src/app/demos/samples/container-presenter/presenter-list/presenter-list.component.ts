import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Person } from '../../person/person.model';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
    selector: 'app-presenter-list',
    templateUrl: './presenter-list.component.html',
    styleUrls: ['./presenter-list.component.scss'],
    standalone: true,
    imports: [MatCard, MatCardHeader, MatCardTitle]
})
export class PresenterListComponent {

  @Input() persons: Person[] = [];
  @Output() personSelected = new EventEmitter<Person>();

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['persons']) {
      console.log('receiving new persons:', changes['persons'].currentValue);
    }
  }

  selectPerson(p: Person) {
    this.personSelected.emit(p);
  }
}
