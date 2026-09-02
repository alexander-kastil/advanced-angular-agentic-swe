import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Person } from '../../person/person.model';

@Component({
  selector: 'app-presenter-list',
  templateUrl: './presenter-list.component.html',
  styleUrls: ['./presenter-list.component.scss']
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
