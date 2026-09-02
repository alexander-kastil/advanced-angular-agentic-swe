import { Component, computed, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ShopItemComponent } from '../shop-item/shop-item.component';
import { FoodCartItem } from '../shop-item/food-cart-item.model';
import { FoodItem } from '../food.model';
import { OFFLINE_CATALOG_HEADER } from '../../offline-catalog.interceptor';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-food-list',
  imports: [ShopItemComponent],
  templateUrl: './food-list.component.html',
  styleUrl: './food-list.component.scss',
})
export class FoodListComponent {
  private readonly catalog = httpResource<FoodItem[]>(() => `${environment.api}food`);

  readonly food = computed(() => this.catalog.value() ?? []);
  readonly offline = computed(() => this.catalog.headers()?.has(OFFLINE_CATALOG_HEADER) ?? false);
  readonly cart = signal<FoodCartItem[]>([]);
  readonly total = computed(() =>
    this.cart().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  updateCart(cartItem: FoodCartItem) {
    this.cart.update((items) => {
      const idx = items.findIndex((i) => i.id === cartItem.id);
      if (idx >= 0) {
        return items.map((i, index) => (index === idx ? cartItem : i));
      }
      return [...items, cartItem];
    });
  }
}
