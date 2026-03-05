import { ComponentFixture, TestBed } from '@angular/core/testing';

import { A11yComponent } from './a11y.component';

describe('A11yComponent', () => {
  let component: A11yComponent;
  let fixture: ComponentFixture<A11yComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [A11yComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(A11yComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
