import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FoodDetailsComponent } from './food-details.component';
import { offlineCatalogInterceptor } from '../../offline-catalog.interceptor';

describe('FoodDetailsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodDetailsComponent],
      providers: [
        provideHttpClient(withInterceptors([offlineCatalogInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: '2' })) } },
      ],
    }).compileComponents();
  });

  it('renders the fallback dish when the API is unreachable', async () => {
    const fixture = TestBed.createComponent(FoodDetailsComponent);
    fixture.detectChanges();
    TestBed.tick();

    TestBed.inject(HttpTestingController)
      .expectOne((req) => req.url.endsWith('food/2'))
      .error(new ProgressEvent('error'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.item.value()?.name).toBe('Blini with Salmon');
    expect(fixture.nativeElement.textContent).toContain('Blini with Salmon');
  });
});
