import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ShopItemComponent } from '../shop-item/shop-item.component';
import { FoodCartItem } from '../shop-item/food-cart-item.model';
import { FoodItem } from '../food.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-food-list',
  imports: [ShopItemComponent],
  templateUrl: './food-list.component.html',
  styleUrl: './food-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodListComponent {
  food = httpResource<FoodItem[]>(() => `${environment.api}food`);
  cart = signal<FoodCartItem[]>([]);

  updateCart(cartItem: FoodCartItem) {
    this.cart.update(items => {
      const idx = items.findIndex(i => i.id === cartItem.id);
      if (idx >= 0) {
        return items.map((i, index) => index === idx ? cartItem : i);
      }
      return [...items, cartItem];
    });
  }
}
