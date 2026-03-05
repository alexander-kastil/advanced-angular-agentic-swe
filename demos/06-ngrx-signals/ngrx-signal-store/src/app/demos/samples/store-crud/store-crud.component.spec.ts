import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCrudComponent } from './store-crud.component';

describe('StoreCrudComponent', () => {
  let component: StoreCrudComponent;
  let fixture: ComponentFixture<StoreCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
