import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerPresenterSignalsComponent } from './container-presenter-signals.component';

describe('ContainerPresenterSignalsComponent', () => {
  let component: ContainerPresenterSignalsComponent;
  let fixture: ComponentFixture<ContainerPresenterSignalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerPresenterSignalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContainerPresenterSignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
