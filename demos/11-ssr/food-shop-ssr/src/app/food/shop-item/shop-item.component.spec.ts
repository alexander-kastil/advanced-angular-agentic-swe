import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ShopItemComponent } from './shop-item.component';
import { FALLBACK_FOOD } from '../food.data';

describe('ShopItemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopItemComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the dish name and price', () => {
    const fixture = TestBed.createComponent(ShopItemComponent);
    fixture.componentRef.setInput('food', FALLBACK_FOOD[0]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Butter Chicken');
    expect(fixture.nativeElement.textContent).toContain('12.00');
  });

  it('emits the changed cart item', () => {
    const fixture = TestBed.createComponent(ShopItemComponent);
    fixture.componentRef.setInput('food', FALLBACK_FOOD[0]);
    fixture.detectChanges();

    let emitted: { id: number; quantity: number } | undefined;
    fixture.componentInstance.itemChanged.subscribe((item) => (emitted = item));
    fixture.componentInstance.handleAmountChange(3);

    expect(emitted).toMatchObject({ id: 1, quantity: 3 });
  });
});
