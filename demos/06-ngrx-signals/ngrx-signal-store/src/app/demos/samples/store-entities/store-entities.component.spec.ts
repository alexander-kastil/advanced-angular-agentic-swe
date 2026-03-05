import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreEntitiesComponent } from './store-entities.component';

describe('StoreEntitiesComponent', () => {
  let component: StoreEntitiesComponent;
  let fixture: ComponentFixture<StoreEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreEntitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
