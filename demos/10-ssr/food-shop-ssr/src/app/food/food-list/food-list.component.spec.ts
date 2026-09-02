import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { FoodListComponent } from './food-list.component';
import { offlineCatalogInterceptor } from '../../offline-catalog.interceptor';
import { FALLBACK_FOOD } from '../food.data';

describe('FoodListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodListComponent],
      providers: [
        provideHttpClient(withInterceptors([offlineCatalogInterceptor])),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  it('renders the catalog returned by the API', async () => {
    const fixture = TestBed.createComponent(FoodListComponent);
    fixture.detectChanges();
    TestBed.tick();

    TestBed.inject(HttpTestingController)
      .expectOne((req) => req.url.endsWith('food'))
      .flush([{ id: 9, name: 'Goulash', price: 14, inStock: 4 }]);
    await fixture.whenStable();

    expect(fixture.componentInstance.food()).toHaveLength(1);
    expect(fixture.componentInstance.offline()).toBe(false);
  });

  it('falls back to the built-in catalog when the API is unreachable', async () => {
    const fixture = TestBed.createComponent(FoodListComponent);
    fixture.detectChanges();
    TestBed.tick();

    TestBed.inject(HttpTestingController)
      .expectOne((req) => req.url.endsWith('food'))
      .error(new ProgressEvent('error'));
    await fixture.whenStable();

    expect(fixture.componentInstance.food()).toEqual(FALLBACK_FOOD);
    expect(fixture.componentInstance.offline()).toBe(true);
  });

  it('sums the cart total', () => {
    const fixture = TestBed.createComponent(FoodListComponent);
    fixture.componentInstance.updateCart({ ...FALLBACK_FOOD[0], quantity: 2 });

    expect(fixture.componentInstance.total()).toBe(FALLBACK_FOOD[0].price * 2);
  });
});
