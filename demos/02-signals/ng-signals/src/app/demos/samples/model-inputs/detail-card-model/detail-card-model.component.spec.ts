import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCardModelComponent } from './detail-card-model.component';

describe('DetailCardModelComponent', () => {
  let component: DetailCardModelComponent;
  let fixture: ComponentFixture<DetailCardModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailCardModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailCardModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
