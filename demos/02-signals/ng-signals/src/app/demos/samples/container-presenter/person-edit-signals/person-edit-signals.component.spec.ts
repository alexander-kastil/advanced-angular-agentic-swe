import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonEditSignalsComponent } from './person-edit-signals.component';

describe('PersonEditSignalsComponent', () => {
  let component: PersonEditSignalsComponent;
  let fixture: ComponentFixture<PersonEditSignalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonEditSignalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonEditSignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
