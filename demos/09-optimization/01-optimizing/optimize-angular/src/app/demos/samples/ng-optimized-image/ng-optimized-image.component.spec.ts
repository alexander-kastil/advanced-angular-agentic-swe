import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgOptimizedImageComponent } from './ng-optimized-image.component';

describe('NgOptimizedImageComponent', () => {
  let component: NgOptimizedImageComponent;
  let fixture: ComponentFixture<NgOptimizedImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NgOptimizedImageComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(NgOptimizedImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
