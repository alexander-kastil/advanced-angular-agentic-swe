import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalEffectsComponent } from './signal-effects.component';

describe('SignalEffectsComponent', () => {
  let component: SignalEffectsComponent;
  let fixture: ComponentFixture<SignalEffectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalEffectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalEffectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
