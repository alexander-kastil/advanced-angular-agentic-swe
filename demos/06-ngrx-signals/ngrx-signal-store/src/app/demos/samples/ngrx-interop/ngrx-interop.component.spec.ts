import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgrxInteropComponent } from './ngrx-interop.component';

describe('NgrxInteropComponent', () => {
  let component: NgrxInteropComponent;
  let fixture: ComponentFixture<NgrxInteropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgrxInteropComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgrxInteropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
