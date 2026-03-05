import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomStoreFeaturesComponent } from './custom-store-features.component';

describe('CustomStoreFeaturesComponent', () => {
  let component: CustomStoreFeaturesComponent;
  let fixture: ComponentFixture<CustomStoreFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomStoreFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomStoreFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
