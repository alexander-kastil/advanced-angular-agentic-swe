import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeepSignalsComponent } from './deep-signals.component';

describe('DeepSignalsComponent', () => {
  let component: DeepSignalsComponent;
  let fixture: ComponentFixture<DeepSignalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeepSignalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeepSignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
