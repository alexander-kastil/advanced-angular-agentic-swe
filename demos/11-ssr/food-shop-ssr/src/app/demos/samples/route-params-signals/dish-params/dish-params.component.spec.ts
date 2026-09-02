import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DishParamsComponent } from './dish-params.component';

describe('DishParamsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DishParamsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('requests the dish named by the id input and renders it', async () => {
    const fixture = TestBed.createComponent(DishParamsComponent);
    fixture.componentRef.setInput('id', '2');
    fixture.detectChanges();

    TestBed.tick();

    const http = TestBed.inject(HttpTestingController);
    http.expectOne('http://localhost:3010/food/2').flush({
      id: 2,
      name: 'Blini with Salmon',
      price: 9,
      inStock: 12,
      description: 'Mini pancakes.',
    });

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Blini with Salmon');
    expect(fixture.nativeElement.textContent).toContain('9.00');
    http.verify();
  });

  it('falls back to the empty branch when the dish is missing', async () => {
    const fixture = TestBed.createComponent(DishParamsComponent);
    fixture.componentRef.setInput('id', '99');
    fixture.detectChanges();

    TestBed.tick();

    const http = TestBed.inject(HttpTestingController);
    http.expectOne('http://localhost:3010/food/99').flush(null);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No dish for id 99');
    http.verify();
  });

  it('keeps the optional highlight input at its default', () => {
    const fixture = TestBed.createComponent(DishParamsComponent);
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();

    expect(fixture.componentInstance.highlight()).toBe('');
  });
});
