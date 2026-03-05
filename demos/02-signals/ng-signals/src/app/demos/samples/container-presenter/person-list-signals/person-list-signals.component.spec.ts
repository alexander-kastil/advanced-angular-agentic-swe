import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { PersonListSignalsComponent } from './person-list-signals.component';
import { Person } from '../person.model';

describe('PersonListSignalsComponent', () => {
  let component: PersonListSignalsComponent;
  let fixture: ComponentFixture<PersonListSignalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonListSignalsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PersonListSignalsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const mockPersons: Person[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, wealth: 'comfortable', gender: 'male' }
    ];
    fixture.componentRef.setInput('persons', mockPersons);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should emit personSelected when selectPerson is called', () => {
    const mockPersons: Person[] = [
      { id: 1, name: 'Jane Smith', email: 'jane@example.com', age: 28, wealth: 'comfortable', gender: 'female' }
    ];
    fixture.componentRef.setInput('persons', mockPersons);
    fixture.detectChanges();

    let emittedPerson: Person | undefined;
    component.personSelected.subscribe((person: Person) => {
      emittedPerson = person;
    });

    component.selectPerson(mockPersons[0]);
    expect(emittedPerson).toEqual(mockPersons[0]);
  });
});
