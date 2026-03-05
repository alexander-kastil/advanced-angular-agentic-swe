import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeepSignalComponent } from './deep-signal.component';

describe('DeepSignalComponent', () => {
  let component: DeepSignalComponent;
  let fixture: ComponentFixture<DeepSignalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeepSignalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeepSignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
